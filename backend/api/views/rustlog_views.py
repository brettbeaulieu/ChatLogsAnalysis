# drf view to handle rustlog log grabbing requests

import requests
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..common import parse_dates
from ..tasks import get_rustlog_task


class RustlogViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["get"], url_path="channels")
    def channels(self, request):
        """
        Return all channels found in a Rustlog repository.

        Arguments:
            request -- HttpRequest object containing the following fields:
                - repo_url: str

        Returns:
            {data: {valid: boolean, channels: string[]}, status: number}
        """
        # Retrieve the repository URL from query parameters
        repo_url = request.query_params.get("repo_url")

        # Check if repo_url is provided
        if not repo_url:
            return Response(
                {"error": "repo_url parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        HTTPS_PREFIX = "https://"
        # If it's currently http://, change to https://
        if repo_url.startswith("http://"):
            repo_url = repo_url.replace("http://", HTTPS_PREFIX)

        # If there's no https:// prefix, add it
        if not repo_url.startswith(HTTPS_PREFIX):
            repo_url = HTTPS_PREFIX + repo_url

        # Perform the GET request to the channels endpoint
        try:
            response = requests.get(f"{repo_url}/channels", timeout=3)
        except requests.RequestException:
            # Handle exceptions from the requests library (e.g., connection errors)
            return Response(
                {"data": {"valid": False, "channels": []}},
                status=status.HTTP_200_OK,
            )

        # Parse the JSON response
        try:
            data = response.json()
        except ValueError as e:
            print("DEBUG: ValueError occurred while parsing JSON:", e)

            return Response(
                {"data": {"valid": False, "channels": []}},
                status=status.HTTP_200_OK,
            )

        # Return the JSON data or an empty dictionary if no data
        return Response(
            {
                "data": (
                    {"valid": True, "channels": data["channels"]}
                    if data
                    else {"valid": False, "channels": []}
                )
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=["post"], url_path="logs")
    def logs(self, request):
        """
        Create a task to retrieve logs from a Rustlog repository, and return
        the associated ticket number.

        Arguments:
            request -- HttpRequest object containing the following fields:
                - repo_name: str
                - channel_name: str
                - start_date: str
                - end_date: str

        Returns:
            Response object with status code 200 OK, containing 'message' and
            'ticket' fields
        """

        # unwrap stringified JSON body
        repo_name = request.data.get("repo_name")
        channel_name = request.data.get("channel_name")
        start_date_str = request.data.get("start_date")
        end_date_str = request.data.get("end_date")

        start_date, end_date = parse_dates(start_date_str, end_date_str)

        # Dispatch task to Celery
        result = get_rustlog_task.delay(repo_name, channel_name, start_date, end_date)
        return Response(
            {
                "message": "Successfully enqueued file for preprocessing",
                "task_id": str(result.id),
            },
            status=status.HTTP_200_OK,
        )
