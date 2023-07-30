from rest_framework.permissions import BasePermission
class IsAdmin(BasePermission):
    """
    Allow access to only Admins.
    
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_admin)
    
class IsStudent(BasePermission):
    """
    Allow access to only Admins.
    
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and not request.user.is_admin)