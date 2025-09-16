from django.http import JsonResponse
from rest_framework import status, viewsets, serializers
from rest_framework.decorators import action
from django_celery_results.models import TaskResult
from celery.result import AsyncResult


class TaskResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskResult
        fields = ["task_id", "status"]


class TaskViewSet(viewsets.ModelViewSet):

    queryset = TaskResult.objects.all()
    serializer_class = TaskResultSerializer

    @action(detail=False, methods=["get"], url_path="status")
    def status(self, request):
        """
        Check the status of a Celery task.

        Arguments:
            request -- HttpRequest object containing the following fields:
                - task_id: str

        Returns:
            Response object with status code 200 OK, along with the status of the task
        """

        task_id = request.query_params.get("task_id", "")

        if not task_id:
            return JsonResponse(
                data={
                    "error": "Missing task_id parameter",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get the task result using the task ID
        task_result = AsyncResult(task_id)

        # Return the status of the task
        return JsonResponse(
            {"task_id": task_id, "status": task_result.status},
            status=status.HTTP_200_OK,
        )
