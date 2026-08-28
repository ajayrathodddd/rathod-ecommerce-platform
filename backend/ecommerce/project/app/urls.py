from app import views
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes, name="getRoutes"),
    path('products/', views.getProducts, name="getProducts"),
    path('product/<str:pk>/', views.getProduct, name="getProduct"),
    
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # ADD THIS LINE RIGHT HERE:
    path('users/signup/', views.registerUser, name="signup"),
    path('users/register/', views.registerUser, name="register"),
    
    path('activate/<uidb64>/<token>/', views.ActivateAccountView.as_view(), name='activate'),
    
    path('orders/add/', views.addOrderItems, name='orders-add'),
    path('orders/', views.getOrders, name='orders'),
    path('orders/myorders/', views.getMyOrders, name='myorders'),
    path('orders/<str:pk>/', views.getOrderById, name='user-order'),

    # Admin URLs
    path('products/create/', views.createProduct, name="product-create"),
    path('products/update/<str:pk>/', views.updateProduct, name="product-update"),
    path('products/delete/<str:pk>/', views.deleteProduct, name="product-delete"),
    path('products/upload/', views.uploadImage, name="image-upload"),

    # Static User Routes
    path('users/getallusers/', views.getUsers, name='users'),
    path('users/profile/', views.getUserProfile, name="getUserProfile"),
    path('users/profile/update/', views.updateUserProfile, name="updateUserProfile"),
    path('users/update/<str:pk>/', views.updateUser, name='updateUser'),
    path('users/delete/<str:pk>/', views.deleteUser, name='deleteUser'),
    
    # Dynamic User Route (Must be last)
    path('users/<str:pk>/', views.getUserById, name='getUserById'),
]