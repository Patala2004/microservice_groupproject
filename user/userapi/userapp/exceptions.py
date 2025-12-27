from rest_framework.exceptions import APIException

class ExternalServiceUnavailable(APIException):
    status_code = 503
    default_detail = "External service unavailable"
    default_code = "service_unavailable"
    
class ExternalServiceError(APIException):
    def __init__(self, status_code, detail=None, code=None):
        status_code = status_code
        super().__init__(detail, code)