import angular from 'angular';
import angularToArrayfilter from 'angular-toarrayfilter';
import hcMarked from 'angular-marked';
import ngReactModule from 'ngreact';
import ngRoute from 'angular-route';
import uiBootstrap from 'angular1-ui-bootstrap4';
import mcResizer from '../vendor/resizer';

import treeherderModule from './treeherder';
import AnnotationsTemplate from '../plugins/annotations/main.html';
import AutoClassificationTemplate from '../plugins/auto_classification/main.html';
import FailureSummaryTemplate from '../plugins/failure_summary/main.html';
import JobDetailsTemplate from '../plugins/job_details/main.html';
import PerfDetailsTemplate from '../plugins/perf_details/main.html';
import pluginPanelTemplate from '../plugins/pluginpanel.html';
import SimilarJobsTemplate from '../plugins/similar_jobs/main.html';
import thActiveFiltersBarTemplate from '../partials/main/thActiveFiltersBar.html';
import thFilterChickletsTemplate from '../partials/main/thFilterChicklets.html';
import thGlobalTopNavPanelTemplate from '../partials/main/thGlobalTopNavPanel.html';
import thHelpMenuTemplate from '../partials/main/thHelpMenu.html';
import thInfraMenuTemplate from '../partials/main/thInfraMenu.html';
import thPinboardPanelTemplate from '../partials/main/thPinboardPanel.html';
import thShortcutTableTemplate from '../partials/main/thShortcutTable.html';
import thTreeherderUpdateBarTemplate from '../partials/main/thTreeherderUpdateBar.html';
import thWatchedRepoNavPanelTemplate from '../partials/main/thWatchedRepoNavPanel.html';

const treeherderApp = angular.module('treeherder.app', [
  treeherderModule.name,
  uiBootstrap,
  ngRoute,
  // Remove when `ui/plugins/pluginpanel.html` converted to React.
  mcResizer,
  // Remove when `ui/plugins/perf_details/main.html` converted to React.
  angularToArrayfilter,
  ngReactModule.name,
  // Remove when `ui/partials/main/tcjobactions.html` converted to React.
  hcMarked,
]);

treeherderApp.config(['$compileProvider', '$locationProvider', '$routeProvider', '$httpProvider',
    '$logProvider', '$resourceProvider', 'localStorageServiceProvider',
    function ($compileProvider, $locationProvider, $routeProvider, $httpProvider, $logProvider,
             $resourceProvider, localStorageServiceProvider) {
        // Disable debug data & legacy comment/class directive syntax, as recommended by:
        // https://docs.angularjs.org/guide/production
        $compileProvider.debugInfoEnabled(false);
        $compileProvider.commentDirectivesEnabled(false);
        $compileProvider.cssClassDirectivesEnabled(false);

        // Revert to the legacy Angular <=1.5 URL hash prefix to save breaking existing links:
        // https://docs.angularjs.org/guide/migration#commit-aa077e8
        $locationProvider.hashPrefix('');

        // Don't strip trailing slashes from calculated URLs
        $resourceProvider.defaults.stripTrailingSlashes = false;

        // All queries should be cancellable by default (why is this configurable??)
        $resourceProvider.defaults.cancellable = true;

        // enable or disable debug messages using $log.
        // comment out the next line to enable them
        $logProvider.debugEnabled(false);

        localStorageServiceProvider.setPrefix("treeherder");

        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.useApplyAsync(true);

        $routeProvider
            .when('/jobs', {
                // see controllers/filters.js ``skipNextSearchChangeReload`` for
                // why we set this to false.
                reloadOnSearch: false
            })
            .when('/jobs/:tree', {
                reloadOnSearch: false
            })
            .otherwise({ redirectTo: '/jobs' });
    }]).run(['$templateCache', ($templateCache) => {
        // Templates used by ng-include have to be manually put in the template cache.
        // Those used by directives should instead be imported at point of use.
        $templateCache.put('partials/main/thActiveFiltersBar.html', thActiveFiltersBarTemplate);
        $templateCache.put('partials/main/thFilterChicklets.html', thFilterChickletsTemplate);
        $templateCache.put('partials/main/thGlobalTopNavPanel.html', thGlobalTopNavPanelTemplate);
        $templateCache.put('partials/main/thHelpMenu.html', thHelpMenuTemplate);
        $templateCache.put('partials/main/thInfraMenu.html', thInfraMenuTemplate);
        $templateCache.put('partials/main/thPinboardPanel.html', thPinboardPanelTemplate);
        $templateCache.put('partials/main/thShortcutTable.html', thShortcutTableTemplate);
        $templateCache.put('partials/main/thTreeherderUpdateBar.html', thTreeherderUpdateBarTemplate);
        $templateCache.put('partials/main/thWatchedRepoNavPanel.html', thWatchedRepoNavPanelTemplate);
        $templateCache.put('plugins/annotations/main.html', AnnotationsTemplate);
        $templateCache.put('plugins/auto_classification/main.html', AutoClassificationTemplate);
        $templateCache.put('plugins/failure_summary/main.html', FailureSummaryTemplate);
        $templateCache.put('plugins/job_details/main.html', JobDetailsTemplate);
        $templateCache.put('plugins/perf_details/main.html', PerfDetailsTemplate);
        $templateCache.put('plugins/pluginpanel.html', pluginPanelTemplate);
        $templateCache.put('plugins/similar_jobs/main.html', SimilarJobsTemplate);
    }]);

export default treeherderApp;
