from .models import Log

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def log_activity(request, action, description, user=None, voter=None):
    """
    Log user or voter activities to the Log model.
    If user is not provided, tries to use request.user if authenticated.
    """
    log_user = user
    if log_user is None and hasattr(request, 'user') and getattr(request.user, 'is_authenticated', False):
        # Only set user if it's a User instance (not Voter)
        from backend.accounts.models import User
        if isinstance(request.user, User):
            log_user = request.user

    Log.objects.create(
        user=log_user,
        voter=voter,
        log_action=action,
        ip_address=get_client_ip(request),
        description=description
    )
