import {Injectable} from '@angular/core';
import {Apollo, gql, QueryRef} from 'apollo-angular';
import { StationsEnum } from '../enums/radioFrance.enum';
import {Brand, Grid, Live} from '../models/radioFrance.interface';

// see https://apollo-angular.com/docs/development-and-testing/testing

@Injectable({
  providedIn: 'root'
})
export class RadioService {

  constructor(private apollo: Apollo) {}

  /**
   * GET LIVE
   *
   * @param {StationsEnum} station
   * @return {*}  {QueryRef<Live>}
   * @memberof RadioService
   */
  getLive(station: StationsEnum): QueryRef<Live> {
    const GET_LIVE = gql`
      query GetLive($station: StationsEnum!) {
        live(station: $station) {
          song {
            start
            end
            track {
              title
              albumTitle
              label
              mainArtists
              authors
              composers
              performers
              productionDate
            }
          }
        }
      }
    `;

    return this.apollo.watchQuery<any>({
      query: GET_LIVE,
      variables: {station}
    })
  }

  /**
   * GET BRAND
   *
   * @param {StationsEnum} station
   * @return {*}  {QueryRef<Brand>}
   * @memberof RadioService
   */
  getBrand(station: StationsEnum): QueryRef<Brand> {
    const GET_BRAND = gql`
      query GetBrand($id: StationsEnum!) {
        brand(id: $id) {
          id
          title
          baseline
          description
          websiteUrl
          liveStream
          localRadios {
            id
            title
            description
            liveStream
          }
          webRadios {
            id
            title
            description
            liveStream
          }
        }
      }
    `;
    return this.apollo.watchQuery<any>({
      query: GET_BRAND,
      variables: {id: station}
    });
  }

  /**
   * GET GRID
   *
   * @param {StationsEnum} station
   * @return {*}  {QueryRef<Grid[]>}
   * @memberof RadioService
   */
  getGrid(station: StationsEnum): QueryRef<Grid> {
    const end = Math.round(new Date().getTime() / 1000);
    const start = end - 3600; // il y a 1 heure
    const GET_GRID = gql`
      query GetGrid($start: Int!, $end: Int!, $station: StationsEnum!) {
        grid(start: $start, end: $end, station: $station) {
          ... on TrackStep {
            start
            end
            track {
              title
              albumTitle
              label
              mainArtists
              authors
              composers
              performers
              productionDate
            }
          }
        }
      }
    `;
    return this.apollo.watchQuery<any>({
      query: GET_GRID,
      variables: {start, end, station}
    })
  }

}
