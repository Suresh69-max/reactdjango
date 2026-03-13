from rest_framework import serializers
from .models import GroceryItem

class GroceryItemSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=200)
    completed = serializers.BooleanField(default=False)
    created_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return GroceryItem.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.completed = validated_data.get('completed', instance.completed)
        instance.save()
        return instance