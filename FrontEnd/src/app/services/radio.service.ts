import {Injectable} from '@angular/core';
import {ApolloQueryResult} from '@apollo/client/core';
import {Apollo, gql, QueryRef} from 'apollo-angular';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {StationsEnum} from '../enums/radioFrance.enum';
import {Brand, Grid, Live, Song} from '../models/radioFrance.interface';

// see https://apollo-angular.com/docs/development-and-testing/testing

@Injectable({
  providedIn: 'root'
})
export class RadioService {
  constructor(private apollo: Apollo) {}

  /**
   * GET an object LIVE by StationsEnum
   *
   * @param {StationsEnum} station
   * @return {*}  {QueryRef<Live>}
   * @memberof RadioService
   */
  public getLive(station: StationsEnum): QueryRef<Live> {
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
    });
  }

  /**
   * GET an object BRAND by StationsEnum
   *
   * @param {StationsEnum} station
   * @return {*}  {QueryRef<Brand>}
   * @memberof RadioService
   */
  private getBrand(station: StationsEnum): QueryRef<Brand> {
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
   * GET an object GRID by StationsEnum
   *
   * @private
   * @param {StationsEnum} station
   * @return {*}  {QueryRef<Grid>}
   * @memberof RadioService
   */
  private getGrid(station: StationsEnum): QueryRef<Grid> {
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
    });
  }

  /**
   * GET observable of GRID
   *
   * @param {StationsEnum} station
   * @return {*}  {Observable<Song[]>}
   * @memberof RadioService
   */
  public subscribeGrid(station: StationsEnum): Observable<Song[]> {
    return this.getGrid(station).valueChanges.pipe(
      map((result: ApolloQueryResult<Grid>) => result.data.grid.slice().reverse())
    );
  }

  /**
   * GET observable of BRAND
   *
   * @param {StationsEnum} station
   * @return {*}  {Observable<string>}
   * @memberof RadioService
   */
  public subscribeBrand(station: StationsEnum): Observable<string> {
    return this.getBrand(station).valueChanges.pipe(
      map((result: ApolloQueryResult<Brand>) => result.data.brand.liveStream)
    );
  }

  /**
   * GET observable of SONG
   *
   * @param {StationsEnum} station
   * @return {*}  {Observable<Song>}
   * @memberof RadioService
   */
  public subscribeLive(station: StationsEnum): Observable<Song> {
    return this.getLive(station).valueChanges.pipe(map((result: ApolloQueryResult<Live>) => result.data.live.song));
  }
}
