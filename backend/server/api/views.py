from django.http import JsonResponse

def hello(request):
    return JsonResponse({'message': 'API is working!'})
def thelo(request):
    return JsonResponse({'':'Test 1 cleared'})