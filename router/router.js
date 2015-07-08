ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map("map", {
            center: [55.745508, 37.435225],
            zoom: 13
        }, {
            searchControlProvider: 'yandex#search'
        });

    // Adding driving directions to the map from Krylatsky Hills street to the metro station "Kuntsevskaya" via the station "Molodezhnaya" and then to the metro station "Pionerskaya". Route points can be set in 3 ways: as a string, as an object, or as an array of geocoordinates.
    ymaps.route([
        'Москва, улица Крылатские холмы',
        {
            point: 'Москва, метро Молодежная',
            // Metro "Molodezhnaya" is a through point (passing through this point, but not stopping at it).
            type: 'viaPoint'
        },
        [55.731272, 37.447198], // метро "Кунцевская".
        'Москва, метро Пионерская'
    ]).then(function (route) {
        myMap.geoObjects.add(route);
        // Setting the contents of the icons for the start and end points of the route. Using the getWayPoints() method to get an array of waypoints. The getViaPoints method can be used for getting the route's through points.
        var points = route.getWayPoints(),
            lastPoint = points.getLength() - 1;
        // Setting the placemark style - icons will be red, and their images will stretch to fit the content.
        points.options.set('preset', 'islands#redStretchyIcon');
        // Setting the placemark content in the start and end points.
        points.get(0).properties.set('iconContent', 'Точка отправления');
        points.get(lastPoint).properties.set('iconContent', 'Точка прибытия');

        // Analyzing the route by segments. A segment is a section of the route up to the next change of direction. In order to obtain the route segments, you first need to obtain each path of the route separately. The entire route is divided into two paths: 1) from Krylatsky Hills street to the station "Kuntsevskaya"; 2) from "Kuntsevskaya" station to "Pionerskaya".

        var moveList = 'Трогаемся,</br>',
            way,
            segments;
        // Getting an array of paths.
        for (var i = 0; i < route.getPaths().getLength(); i++) {
            way = route.getPaths().get(i);
            segments = way.getSegments();
            for (var j = 0; j < segments.length; j++) {
                var street = segments[j].getStreet();
                moveList += ('Едем ' + segments[j].getHumanAction() + (street ? ' на ' + street : '') + ', проезжаем ' + segments[j].getLength() + ' м.,');
                moveList += '</br>'
            }
        }
        moveList += 'Останавливаемся.';
        // Outputting the route form.
        $('#list').append(moveList);
    }, function (error) {
        alert('Возникла ошибка: ' + error.message);
    });
}
