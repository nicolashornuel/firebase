'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">angular documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-1d58b7a3e3fcfa2512dcb4230fe9693c4e3ed71a86505ab1e75c3c5378673af3db6ea39a8afdefc83f17b01ab3ec6d374c8ad7428834bd1f8c042d21102889c9"' : 'data-target="#xs-components-links-module-AppModule-1d58b7a3e3fcfa2512dcb4230fe9693c4e3ed71a86505ab1e75c3c5378673af3db6ea39a8afdefc83f17b01ab3ec6d374c8ad7428834bd1f8c042d21102889c9"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-1d58b7a3e3fcfa2512dcb4230fe9693c4e3ed71a86505ab1e75c3c5378673af3db6ea39a8afdefc83f17b01ab3ec6d374c8ad7428834bd1f8c042d21102889c9"' :
                                            'id="xs-components-links-module-AppModule-1d58b7a3e3fcfa2512dcb4230fe9693c4e3ed71a86505ab1e75c3c5378673af3db6ea39a8afdefc83f17b01ab3ec6d374c8ad7428834bd1f8c042d21102889c9"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AudioElementComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AudioElementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BottomSheetComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BottomSheetComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PreferenceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PreferenceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RadioPlayerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RadioPlayerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RssFluxComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RssFluxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StarRatingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StarRatingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ToolbarComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ToolbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WatchComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WatchComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GraphQLModule.html" data-type="entity-link" >GraphQLModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link" >MaterialModule</a>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/DestroyService.html" data-type="entity-link" >DestroyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DiscogsService.html" data-type="entity-link" >DiscogsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PreferenceService.html" data-type="entity-link" >PreferenceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RadioService.html" data-type="entity-link" >RadioService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RadioTransformService.html" data-type="entity-link" >RadioTransformService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RadioUtilService.html" data-type="entity-link" >RadioUtilService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RssService.html" data-type="entity-link" >RssService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SearchService.html" data-type="entity-link" >SearchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VideoService.html" data-type="entity-link" >VideoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WikipediaService.html" data-type="entity-link" >WikipediaService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/BlankStep.html" data-type="entity-link" >BlankStep</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Brand.html" data-type="entity-link" >Brand</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BrandDTO.html" data-type="entity-link" >BrandDTO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DiffusionStep.html" data-type="entity-link" >DiffusionStep</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Grid.html" data-type="entity-link" >Grid</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRssChannel.html" data-type="entity-link" >IRssChannel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRssImage.html" data-type="entity-link" >IRssImage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRssItem.html" data-type="entity-link" >IRssItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRssObject.html" data-type="entity-link" >IRssObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Live.html" data-type="entity-link" >Live</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NewsRss.html" data-type="entity-link" >NewsRss</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Preference.html" data-type="entity-link" >Preference</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QueryDiscogs.html" data-type="entity-link" >QueryDiscogs</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QueryGAPI.html" data-type="entity-link" >QueryGAPI</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QueryWikipedia.html" data-type="entity-link" >QueryWikipedia</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SongDTO.html" data-type="entity-link" >SongDTO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Step.html" data-type="entity-link" >Step</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TrackStep.html" data-type="entity-link" >TrackStep</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VideoGAPI.html" data-type="entity-link" >VideoGAPI</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});