from django.shortcuts import render


def base(request):
    return render(request, 'base.html')

def find_place(request):
    # sx = request.POST['sx']
    # sy = request.POST['sy']
    # ex = request.POST['ex']
    # ey = request.POST['ey']
    # route_id = request.POST['route_id']

    sx = 0
    sy = 0
    ex = 0
    ey = 0
    route_id = 0

    return render(request, 'find_place.html', {
        'sx' : sx,
        'sy' : sy,
        'ex' : ex,
        'ey' : ey,
        'route_id' : route_id,
        })


