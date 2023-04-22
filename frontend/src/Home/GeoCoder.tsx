/* eslint-disable */
import React from 'react';
import {useState, useEffect} from 'react';
import {useControl, Marker, MarkerProps, ControlPosition} from 'react-map-gl';
import MapboxGeocoder, {GeocoderOptions} from '@mapbox/mapbox-gl-geocoder';

type GeocoderControlProps = Omit<GeocoderOptions, 'accessToken' | 'mapboxgl' | 'marker'> & {
  mapboxAccessToken: string;
  marker?: boolean | Omit<MarkerProps, 'longitude' | 'latitude'>;

  position: ControlPosition;

  onLoading: (e: object) => void;
  onResults: (e: object) => void;
  onResult: (e: object) => void;
  onError: (e: object) => void;

  setResults: any;
  addressInput: any;
  queryResult: any;
  setLoading: any;
};

/* eslint-disable complexity,max-statements */
export default function GeocoderControl(props: GeocoderControlProps) {
  const [marker, setMarker] = useState<any>(null);
  const [results, setResults] = useState<any>([]);

  const geocoder = useControl<MapboxGeocoder>(
    () => {
      const ctrl = new MapboxGeocoder({
        ...props,
        marker: false,
        accessToken: props.mapboxAccessToken
      });
      ctrl.on('loading', evt => {
        props.onLoading(evt);
        props.setLoading(true)
      });
      ctrl.on('results', evt => {
        props.setLoading(false)
        props.onResults(evt)
        const { features } = evt;
        features.forEach((feature : any) => {
            feature.address_name = feature.place_name.split(', ')[0]
            feature.address_details = feature.place_name.split(', ').slice(1).join(', ')
        })
        setResults(features)
      });
      ctrl.on('result', evt => {
        props.onResult(evt);
        props.setLoading(false)
        const {result} = evt;
        console.log(result)
        const location =
          result &&
          (result.center || (result.geometry?.type === 'Point' && result.geometry.coordinates));
        if (location && props.marker) {
          setMarker(<Marker color='#3B82F6'  longitude={location[0]} latitude={location[1]} />);
        } else {
          setMarker(null);
        }
      });
      ctrl.on('error', props.onError);
      return ctrl;
    },
    {
      position: props.position
    }
  );

  useEffect(() => {
    if (props.queryResult) {
        geocoder.query(props.queryResult.id)
    }
  }, [props.queryResult])

  useEffect(() => {
    if (props.addressInput == '') {
        props.setResults([])
    }
    geocoder.setInput(props.addressInput)
  }, [props.addressInput])

  useEffect(() => {
    props.setResults(results)
  }, [results])

  // @ts-ignore (TS2339) private member
  if (geocoder._map) {
    
    if (geocoder.getProximity() !== props.proximity && props.proximity !== undefined) {
      geocoder.setProximity(props.proximity);
    }
    if (geocoder.getRenderFunction() !== props.render && props.render !== undefined) {
      geocoder.setRenderFunction(props.render);
    }
    if (geocoder.getLanguage() !== props.language && props.language !== undefined) {
      geocoder.setLanguage(props.language);
    }
    if (geocoder.getZoom() !== props.zoom && props.zoom !== undefined) {
      geocoder.setZoom(props.zoom);
    }
    if (geocoder.getFlyTo() !== props.flyTo && props.flyTo !== undefined) {
      geocoder.setFlyTo(props.flyTo);
    }
    if (geocoder.getPlaceholder() !== props.placeholder && props.placeholder !== undefined) {
      geocoder.setPlaceholder(props.placeholder);
    }
    if (geocoder.getCountries() !== props.countries && props.countries !== undefined) {
      geocoder.setCountries(props.countries);
    }
    if (geocoder.getTypes() !== props.types && props.types !== undefined) {
      geocoder.setTypes(props.types);
    }
    if (geocoder.getMinLength() !== props.minLength && props.minLength !== undefined) {
      geocoder.setMinLength(props.minLength);
    }
    if (geocoder.getLimit() !== props.limit && props.limit !== undefined) {
      geocoder.setLimit(props.limit);
    }
    if (geocoder.getFilter() !== props.filter && props.filter !== undefined) {
      geocoder.setFilter(props.filter);
    }
    if (geocoder.getOrigin() !== props.origin && props.origin !== undefined) {
      geocoder.setOrigin(props.origin);
    }
    // Types missing from @types/mapbox__mapbox-gl-geocoder
    // if (geocoder.getAutocomplete() !== props.autocomplete && props.autocomplete !== undefined) {
    //   geocoder.setAutocomplete(props.autocomplete);
    // }
    // if (geocoder.getFuzzyMatch() !== props.fuzzyMatch && props.fuzzyMatch !== undefined) {
    //   geocoder.setFuzzyMatch(props.fuzzyMatch);
    // }
    // if (geocoder.getRouting() !== props.routing && props.routing !== undefined) {
    //   geocoder.setRouting(props.routing);
    // }
    // if (geocoder.getWorldview() !== props.worldview && props.worldview !== undefined) {
    //   geocoder.setWorldview(props.worldview);
    // }
  }
  return marker;
}

const noop = () => {};

GeocoderControl.defaultProps = {
  marker: true,
  onLoading: noop,
  onResults: noop,
  onResult: noop,
  onError: noop
};