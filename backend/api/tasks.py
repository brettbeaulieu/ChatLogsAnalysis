"""
Module to define the Celery tasks dispatched by the django backend.
"""

from datetime import datetime
from celery import shared_task
from .models import ChatFile
from .scripts import preprocess_log, import_rustlog, build_emote_set


@shared_task
def preprocess_task(
    row_id,
    file_path,
    format_str,
    use_sentiment,
    use_emotes,
    emote_set,
    filter_emotes,
    min_words,
):
    """
    Celery task to preprocess a log file.
    """
    try:
        # Perform preprocessing here
        preprocess_log(
            row_id,
            file_path,
            format_str,
            use_sentiment,
            use_emotes,
            emote_set,
            filter_emotes,
            min_words,
        )

        # Update the model
        obj = ChatFile.objects.get(id=row_id)
        obj.is_preprocessed = True
        obj.save()
        return True

    except Exception:
        return False


@shared_task
def build_emote_set_task(set_id):
    """
    Celery task to build an emote set.
    """
    try:
        build_emote_set(set_id)
        return True
    except Exception:
        return False


@shared_task
def get_rustlog_task(
    repo_name: str, channel_name: str, start_date: datetime, end_date: datetime
):
    try:
        logs_imported = import_rustlog(repo_name, channel_name, start_date, end_date)
        return logs_imported
    except Exception as e:
        # fail the task
        raise Exception(f"Failed to import rustlog files: {e}") from e
