from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import GroceryItem
from .serializers import GroceryItemSerializer


class GroceryListAPIView(APIView):

    def get(self, request):
        items = GroceryItem.objects.all()
        serializer = GroceryItemSerializer(items, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = GroceryItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class GroceryDetailAPIView(APIView):

    def get_object(self, pk):
        try:
            return GroceryItem.objects.get(pk=pk)
        except:
            return None

    def patch(self, request, pk):
        item = self.get_object(pk)
        serializer = GroceryItemSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

    def delete(self, request, pk):
        item = self.get_object(pk)
        item.delete()
        return Response(status=204)


class GroceryToggleAPIView(APIView):

    def post(self, request, pk):
        item = GroceryItem.objects.get(pk=pk)
        item.completed = not item.completed
        item.save()
        serializer = GroceryItemSerializer(item)
        return Response(serializer.data)