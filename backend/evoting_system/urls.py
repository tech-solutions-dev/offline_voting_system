from django.contrib import admin
from django.urls import path, include
import debug_toolbar
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('voting.urls')),
    path('api/auth/', include('accounts.urls')),  # Add this line for account/auth endpoints
    path('api/audit/', include('audit.urls')),  # Add this line for audit endpoints
    path('api/elections/', include('elections.urls')),  # Add this line for election endpoints
    path('__debug__/', include(debug_toolbar.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
