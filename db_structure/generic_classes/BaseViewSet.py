from rest_framework import viewsets, status
from rest_framework.response import Response
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError as DRFValidationError

class BaseViewSet(viewsets.ViewSet):
    repository = None  
    serializer_class = None  

    def list(self, request):#Listar todos los datos
        objs = self.repository.get_all()
        serializer = self.serializer_class(objs, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):#Conseguir los valores relacionados a un dato(GET)
        obj = self.repository.get_by_id(pk)
        if obj:
            serializer = self.serializer_class(obj)
            return Response(serializer.data)
        return Response({'error': f'{self.repository.model.__name__} not found'}, status=status.HTTP_404_NOT_FOUND)

    def create(self, request):#Crear nueva instancia(POST)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            try:
                obj = self.repository.create(serializer.validated_data)
                return Response(self.serializer_class(obj).data, status=status.HTTP_201_CREATED)
            except (DjangoValidationError, DRFValidationError) as e:
                return Response(e.message_dict, status=status.HTTP_400_BAD_REQUEST)
            except IntegrityError as e:
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):#Editar los valores de un dato(PUT)
        obj = self.repository.get_by_id(pk)
        if not obj:
            return Response({'error': f'{self.repository.model.__name__} not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(instance=obj, data=request.data)
        if serializer.is_valid():
            try:
                obj = serializer.save()
                return Response(self.serializer_class(obj).data)
            except (DjangoValidationError, DRFValidationError) as e:
                return Response(e.message_dict, status=status.HTTP_400_BAD_REQUEST)
            except IntegrityError as e:
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def destroy(self, request, pk=None):#Eliminar un dato(DESTROY)
        if self.repository.delete(pk):
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'error': f'{self.repository.model.__name__} not found'}, status=status.HTTP_404_NOT_FOUND)
