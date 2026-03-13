from django.urls import path
from .views import *

urlpatterns = [
    path('', GroceryListAPIView.as_view()),
    path('<int:pk>/', GroceryDetailAPIView.as_view()),
    path('<int:pk>/toggle/', GroceryToggleAPIView.as_view()),
]