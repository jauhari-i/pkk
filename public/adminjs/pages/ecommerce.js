//[custom Javascript]
//Project:	Aero - Responsive Bootstrap 4 Template
//Version:  1.0
//Last change:  15/12/2019
//Primary use:	Aero - Responsive Bootstrap 4 Template
//should be included in all pages. It controls some layout
$(function () {
  'use strict';
  $.ajax({
    url: 'http://localhost:3000/api/tenda',
    method: 'GET',
    success: function (data) {
      console.log(data);
    },
  });
  initSparkline();
  MorrisArea();
  initMap();
});

function initSparkline() {
  setTimeout(function () {
    $('.sparkline').each(function () {
      var $this = $(this);
      $this.sparkline('html', $this.data());
    });
  }, 300);
}
function initMap() {
  'use strict';
  setTimeout(function () {
    var mapData = {
      US: 298,
      SA: 200,
      AU: 760,
      IN: 2000000,
      GB: 120,
    };

    if ($('#world-map-markers').length > 0) {
      $('#world-map-markers').vectorMap({
        map: 'world_mill_en',
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderOpacity: 0.25,
        borderWidth: 0,
        color: '#e6e6e6',
        regionStyle: {
          initial: {
            fill: '#f4f4f4',
          },
        },

        markerStyle: {
          initial: {
            r: 5,
            fill: '#fff',
            'fill-opacity': 1,
            stroke: '#000',
            'stroke-width': 1,
            'stroke-opacity': 0.4,
          },
        },

        markers: [
          {
            latLng: [21.0, 78.0],
            name: 'INDIA : 350',
          },
          {
            latLng: [-33.0, 151.0],
            name: 'Australia : 250',
          },
          {
            latLng: [36.77, -119.41],
            name: 'USA : 250',
          },
          {
            latLng: [55.37, -3.41],
            name: 'UK   : 250',
          },
          {
            latLng: [25.2, 55.27],
            name: 'UAE : 250',
          },
        ],

        series: {
          regions: [
            {
              values: {
                US: '#49c5b6',
                SA: '#667add',
                AU: '#50d38a',
                IN: '#60bafd',
                GB: '#ff758e',
              },
              attribute: 'fill',
            },
          ],
        },
        hoverOpacity: null,
        normalizeFunction: 'linear',
        zoomOnScroll: false,
        scaleColors: ['#000000', '#000000'],
        selectedColor: '#000000',
        selectedRegions: [],
        enableZoom: false,
        hoverColor: '#fff',
      });
    }
  }, 500);
}
function MorrisArea() {
  setTimeout(function () {
    Morris.Area({
      element: 'area_chart',
      data: [
        {
          period: '1',
          Sales: 10,
          Revenue: 0,
          Profit: 0,
        },
        {
          period: '2',
          Sales: 50,
          Revenue: 15,
          Profit: 5,
        },
        {
          period: '3',
          Sales: 20,
          Revenue: 50,
          Profit: 65,
        },
        {
          period: '4',
          Sales: 45,
          Revenue: 12,
          Profit: 7,
        },
        {
          period: '5',
          Sales: 30,
          Revenue: 120,
          Profit: 89,
        },
        {
          period: '6',
          Sales: 25,
          Revenue: 80,
          Profit: 40,
        },
        {
          period: '7',
          Sales: 40,
          Revenue: 50,
          Profit: 26,
        },
        {
          period: '8',
          Sales: 20,
          Revenue: 20,
          Profit: 96,
        },
        {
          period: '9',
          Sales: 31,
          Revenue: 50,
          Profit: 56,
        },
        {
          period: '10',
          Sales: 10,
          Revenue: 70,
          Profit: 96,
        },
        {
          period: '11',
          Sales: 40,
          Revenue: 20,
          Profit: 30,
        },
        {
          period: '12',
          Sales: 40,
          Revenue: 120,
          Profit: 100,
        },
      ],
      lineColors: ['#fda582', '#a890d3', '#00ced1'],
      xkey: 'period',
      ykeys: ['Sales', 'Revenue', 'Profit'],
      labels: ['Sales', 'Revenue', 'Profit'],
      pointSize: 0,
      lineWidth: 0,
      resize: true,
      behaveLikeLine: true,
      gridLineColor: '#e0e0e0',
      hideHover: 'auto',
    });
  }, 500);
}
