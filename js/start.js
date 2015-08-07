var scotchApp = angular.module('startApp', ['ngRoute','datatables', 'datatables.scroller','datatables.fixedheader','ngResource','ui.bootstrap-slider','bootstrap-tab','popup-dir','datatablescroll-dir']);

    // configure our routes
    scotchApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'templates/dashboard.html',
                controller  : 'dashbrdController'
            })

            // route for the landing page
            .when('/landing', {
                templateUrl : 'templates/landing.html',
                controller  : 'landingController'
            })

            // route for the appdetails page
            .when('/appdetails', {
                templateUrl : 'templates/appdetails.html',
                controller  : 'appDetailsController'
            })

            .otherwise({redirectTo : '/'})
            /*
            // route for the contact page
            .when('/contact', {
                templateUrl : 'pages/contact.html',
                controller  : 'contactController'
            });*/
    });

    scotchApp.factory('BTAjaxcalls', ['$http', function($http){
        var btservices = {}; 
        btservices.getDboardCounts = function(){
            return  $http.get('dashboard.json');
    }
        return btservices;
    }])

    scotchApp.service('BTAjaxservice',['$http', function ($http) {
        return {
            getservices:function () {
                var calls = {};
                calls.getDashboardCounts = function(successHandler){
                $.ajax({
        url : 'dashboard.json',
        type: 'GET',
        success: function(data){
            successHandler(data);
        }
    })
      
               
            }
            calls.getAppdetails = function(successHandler){
                $.ajax({
        url : 'appdetailone.json',
        type: 'GET',
        success: function(data){
            successHandler(data);
        }
    })
      
               
            }
                return calls;
            },
            addNote:function (noteTitle) {
            },
            deleteNote:function (id) {
            }
        };
    }])

    scotchApp.filter('myTableFilter', function(){
  /* array is first argument, each addiitonal argument is prefixed by a ":" in filter markup*/
  return function(dataArray, searchTerm){
    //console.log(flag);
      if(!dataArray ) return;
      /* when term is cleared, return full array*/
      if( !searchTerm){
          return dataArray
       }else{
           /* otherwise filter the array */
           var term=searchTerm.toLowerCase();
           return dataArray.filter(function( person){

              return person.insuredname.toLowerCase().indexOf(term) > -1 || person.contract_no.toLowerCase().indexOf(term) > -1;    
           });
       } 
  }
  })
    
  scotchApp.filter('myTableFilterAmount', function(){
  /* array is first argument, each addiitonal argument is prefixed by a ":" in filter markup*/
  return function(dataArray, searchTerm){
    //console.log(flag);
      if(!dataArray ) return;
      /* when term is cleared, return full array*/
      if(searchTerm == undefined){
          return dataArray
       }else{
           /* otherwise filter the array */
           //var term=searchTerm.toLowerCase();
           return dataArray.filter(function( person){
              var val = parseFloat(person.contract_face_amt.substring(1,person.contract_face_amt.length).replace(/,/g, ''));
              return  val > searchTerm;    
           });
       } 
  }
  })  

  scotchApp.filter('daysoutstandFilter', function(){
  /* array is first argument, each addiitonal argument is prefixed by a ":" in filter markup*/
  return function(dataArray, searchTerm){
    //console.log(flag);
      if(!dataArray ) return;
      /* when term is cleared, return full array*/
      if(searchTerm == undefined){
          return dataArray
       }else{
           /* otherwise filter the array */
           //var term=searchTerm.toLowerCase();
           return dataArray.filter(function( person){
             var receivedDay = (person.app_received_date.slice(0, 10)).split("-");
              var statusDay = (person.contract_stat_date.slice(0, 10)).split("-");
              var rd = new Date(receivedDay[0], receivedDay[1] - 1, receivedDay[2]);
              var sd = new Date(statusDay[0], statusDay[1] - 1, statusDay[2]);
              var currentDate = new Date();
              var timeDiff = currentDate - rd;
              var ostDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
              return  ostDays > searchTerm;    
           });
       } 
  }
  })     
    scotchApp.factory('BTcommonops', ['$http', function($http){
        var btops = {};
        btops.returnProduct=function(product,contract) {
          if(product == "null"){
            return contract.notificationDesc.ProductType;
          }
        }
        btops.returnFormatDate=function(dateVal) {
                                    var dateString;
                                    if (dateVal != "" && "null" != dateVal && null != dateVal) {
                                        var dateArray = (dateVal.slice(0, 10)).split("-");
                                        dateString = dateArray[1] + "/" + dateArray[2] + "/" + dateArray[0];
                                    } else {
                                        dateString = "";
                                    }
                                    return dateString;
                                }
        btops.adjustTable=function(){
                                    /*var bottomht = $(document).outerHeight() - ($('#wrapper').outerHeight()+$($('header')[0]).outerHeight());
                                    var topht = $($('header')[0]).outerHeight();*/
                                    var refrshht = $(".new-notifications-header").outerHeight();
                                    var tblhdht = $(".landing-data-content-info thead tr").outerHeight();
                                    var reqsuitht = $(".req-suitrev-menu").outerHeight();
                                    var tot = $(window).outerHeight(),ht;
                                    var tblftht = $(".landing-page-footer").outerHeight();
                                    //if (($('.footer-req-agent').hasClass('footer-active')) || ($('.footer-service-center').hasClass('footer-active'))) {
                                        //ht = tot - (tblhdht+refrshht+topht+bottomht+reqsuitht+tblftht+14);
                                        ht = tot - (tblhdht+refrshht+reqsuitht+tblftht+30);
                                    /*}
                                    else{
                                        ht = tot - (tblhdht+refrshht+topht+bottomht+reqsuitht+tblftht);
                                    }*/
                                    $('.landing-data-content-info tbody').css('height',ht);
                                 }
                                 
                                 btops.addCommas =function(nStr){
                    nStr += '';
                    x = nStr.split('.');
                    x1 = x[0];
                    x2 = x.length > 1 ? '.' + x[1] : '';
                    var rgx = /(\d+)(\d{3})/;
                    while (rgx.test(x1)) {
                        x1 = x1.replace(rgx, '$1' + ',' + '$2');
                    }
                    return x1 + x2;
                }
        return btops;
    }])

    scotchApp.controller('dashbrdController',['$scope','$rootScope','$http','$location','BTAjaxcalls','BTAjaxservice', function($scope,$rootScope,$http,$location,BTAjaxcalls,BTAjaxservice) {
        // create a message to display in our view
        

        $scope.getanguCounts = function(data){
            console.log(data);
            //console.log(typeof(data));
            console.log(JSON.stringify(data));
            console.log(JSON.parse(data));
            data = JSON.parse(data);
            //data = JSON.parse(data);
            $scope.notifyCount = data.getDashboardCounts[0].notifications;
            $scope.advisorCount = data.getDashboardCounts[0].os_req_advisor;
            $scope.otherCount = data.getDashboardCounts[0].os_req_servicecentre;
            $scope.newBusinessListCount = data.getDashboardCounts[0].new_business_list;
            $scope.alertCount = data.getDashboardCounts[0].alertCount;
            $scope.$apply();
        }
        //console.log(BTAjaxcalls);
        $scope.getCounts = function(){  
        //BTAjaxcalls.getDboardCounts().success(function(data){

           /* $scope.notifyCount = data.getDashboardCounts[0].notifications;
            $scope.advisorCount = data.getDashboardCounts[0].os_req_advisor;
            $scope.otherCount = data.getDashboardCounts[0].os_req_servicecentre;
            $scope.newBusinessListCount = data.getDashboardCounts[0].new_business_list;
            $scope.alertCount = data.getDashboardCounts[0].alertCount;*/
            //$rootScope.$broadcast("Update", $scope.allCounts);
       // });
           
        BTAjaxservice.getservices().getDashboardCounts($scope.getanguCounts)
    }
    $scope.getCounts();
        /*$http.get('dashboard.json').success(function(data){
            //console.log('data');console.log(data);
            $scope.notifyCount = data.getDashboardCounts[0].notifications;
            $scope.advisorCount = data.getDashboardCounts[0].os_req_advisor;
            $scope.otherCount = data.getDashboardCounts[0].os_req_servicecentre;
            $scope.newBusinessListCount = data.getDashboardCounts[0].new_business_list;
            $scope.alertCount = data.getDashboardCounts[0].alertCount;
        });*/

        $scope.getLandingPage=function(landingTab){
            console.log(landingTab);
            $location.path('/landing');
            $location.search('landingTab', landingTab);
        }


    }]);
    
    /*scotchApp.controller('notifylandingController',['$resource','DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','DTInstances',function($resource,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,DTInstances){
        var vm = this;
    vm.persons = [];
    vm.dtOptions = DTOptionsBuilder.newOptions();
    vm.dtInstance = {};
    var notajax = {};
    notajax.svcall = function(){$resource('notificationList.json').query().$promise.then(function(persons) {
        console.log(persons);
        vm.persons = persons;
    });
}
    return notajax;

    }]);*/
    scotchApp.controller('landingController',['$scope','$rootScope','$controller','$filter','$compile','$window','$http','$location','$resource','BTAjaxcalls','BTcommonops',
                                              'DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','DTInstances',
                                               function($scope,$rootScope,$controller,$filter,$compile,$window,$http,$location,$resource,BTAjaxcalls,BTcommonops,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,DTInstances) {
        
       angular.element($window).bind('resize', function() {
        BTcommonops.adjustTable();
       });
       var vm = this; // here this refers to $scope
        $scope.returnFormatDate = function(date){
            //console.log('called');
           return BTcommonops.returnFormatDate(date);
        }
        $scope.returnProduct = function(product,contract){
            //console.log('called');
           return BTcommonops.returnProduct(product,contract);
        }
        $scope.policyNameSearch = function(value){
            console.log(value);
        }
       /* var mySlider = new Slider("#amount-range-Slider", {
  formatter: function(value) {
    return 'Current value: ' + value;
  }
});*/
        $scope.sliderAmountOptions = {
            
            min: 0,
            max: 5000000,
            step: 20000,
            value : 0,
            formatter : function (value) {
          /*console.log('called');
          console.log(value);*/
          return '>$ ' + BTcommonops.addCommas(value);
          }
        };
        $scope.sliderdaysOutstandingOptions = {
            
            min: 0,
            max: 90,
            step: 1,
            value : 0,
            formatter : function (value) {
          /*console.log('called');
          console.log(value);*/
          return '> ' + value;
          }
        };
        
        $scope.advancedSearch=function(){
          if($scope.sliderAmountValue == 0)
          {
            angular.element(document.querySelector('#amountSlider')).find('.tooltip-main').css('margin-left','-20px');
          }
          if($scope.daysOutstandingValue == 0)
          {
            angular.element(document.querySelector('#daysOutstandingSlider')).find('.tooltip-main').css('margin-left','-16.5px');
          }
        }
       
        /*$scope.formatter = function (value) {
            console.log('called');
            return '>$ ' + value;
        }*/
        /*$scope.sliders = {
            sliderValue: 0,
            formatterFn : function (value) {
            console.log('called');
          }
        }*/
        
       
        /*$scope.formatterFn = function (value) {
            console.log('called');
            return '>$ ' + value;
        };  */
        $scope.notificationStr = $scope.osadvreqStr = $scope.osotherreqStr = $scope.osadvsuitStr = $scope.osothersuitStr = $scope.businesslistStr = "";
        
              $scope.searchpop=function(){
            //console.log($scope.filterTextModal);
            if($scope.filterTextModal != undefined){
            /*$scope.productflag = false;
            $scope.modelflag = false;*/
            $scope.filterText = $scope.filterTextModal;
          }
            if($scope.productTextModal != undefined){
            /*$scope.businesslist = false;
            $scope.businesslistprod = true;*/
            $scope.productText = $scope.productTextModal;
          }
          if($scope.statusTextModal != undefined){
            $scope.statusText = $scope.statusTextModal;
          }
          
          if($scope.sliderAmountValue != undefined){
            //console.log($scope.sliderValue);
            $scope.amountval = $scope.sliderAmountValue;
          }

          if($scope.daysOutstandingValue != undefined){
            //console.log($scope.sliderValue);
            if($scope.daysOutCheck)
            $scope.daysout = $scope.daysOutstandingValue;

          }
          

           /*if($scope.filterTextmodal)
           {
            $scope.modalflag = false;
            $scope.filterText = filterTextmodal;
           }*/
            
        }
        $scope.clearpop=function(){
          /*$scope.businesslistprod = false;
          $scope.businesslist = true;*/
          $scope.filterText = $scope.filterTextModal = $scope.productText = $scope.productTextModal = $scope.statusText = $scope.statusTextModal = undefined;
          $scope.amountval = $scope.daysout = $scope.sliderAmountValue = $scope.daysOutstandingValue = 0;
          $scope.daysOutCheck = false;
        }

        

        
        BTAjaxcalls.getDboardCounts().success(function(data){

            $scope.notifyCount = data.getDashboardCounts[0].notifications;
            $scope.advisorCount = data.getDashboardCounts[0].os_req_advisor;
            $scope.otherCount = data.getDashboardCounts[0].os_req_servicecentre;
            $scope.newBusinessListCount = data.getDashboardCounts[0].new_business_list;
            $scope.alertCount = data.getDashboardCounts[0].alertCount;
            //$rootScope.$broadcast("Update", $scope.allCounts);
        });
        $scope.reqsuiteval = function(tab){
          if(tab == 'req'){
            if($scope.landingTab == "advisor"){
              vm.displayTable('advisor');
            } else if ($scope.landingTab == "other"){
              vm.displayTable('other');
            }

          } else{
            if($scope.landingTab == "advisor"){
              $scope.osadvreq = $scope.osotherreq = $scope.osothersuit = false;
              $scope.osadvsuit = true;
              if($scope.osadvsuitSort == undefined){
          $scope.osadvsuitSort = [[ 4, "desc" ]];
        } 
            vm.dtOptions21 = DTOptionsBuilder.newOptions().withOption('bScrollCollapse', true)
              .withOption('bPaginate', false).withOption('bFilter',false).withOption('bDestroy',true)
              .withOption('bAutoWidth',false).withOption('bInfo',false)
              .withOption("order",$scope.osadvsuitSort)
              .withOption('drawCallback', function(){
                var sort = "";
                if ($('#landingDataTablethree .landing-data-head-content .sorting_asc').length > 0) {
                    sort = $('#landingDataTablethree th').index($('#landingDataTablethree .landing-data-head-content .sorting_asc')) + ',asc';
                    $scope.osadvsuitStr = sort;
                } else if ($('#landingDataTablethree .landing-data-head-content .sorting_desc').length > 0) {
                    sort = $('#landingDataTablethree th').index($('#landingDataTablethree .landing-data-head-content .sorting_desc')) + ',desc';
                    $scope.osadvsuitStr = sort;
                }
                 if ("" == $scope.osadvsuitStr) {
                                        var temp = $scope.osadvsuitSort;
                                        if (null != temp && "" != temp) {
                                            $scope.osadvsuitStr = temp;
                                            var indexDtls = $scope.osadvsuitStr.split(",");
                                            if ("" != indexDtls[0] && "" != indexDtls[1] && parseInt(indexDtls[0]) <= 6) {
                                                $scope.osadvsuitSort = [[parseInt(indexDtls[0]), indexDtls[1]]];
                                            } else {
                                              //agentStr = "5,desc";
                                                $scope.osadvsuitSort = [[4, "desc"]];
                                            }
                                        } else {
                                          //agentStr = "5,desc";
                                                $scope.osadvsuitSort = [[4, "desc"]];
                                        }
                                    } else {
                                        var indexDtls = $scope.osadvsuitStr.split(",");
                                       
                                        $scope.osadvsuitSort = [[parseInt(indexDtls[0]), indexDtls[1]]];
                                    }  
                console.log($scope.osadvsuitStr);
        BTcommonops.adjustTable();
              });
        $resource('osadvisorSuitListone.json').query().$promise.then(function(persons) {
            //console.log(persons);
        vm.persons21 = persons;
        });
            }else if ($scope.landingTab == "other"){
              $scope.osadvreq = $scope.osotherreq = $scope.osadvsuit = false;
              $scope.osothersuit = true;
              if($scope.osothersuitSort == undefined){
          $scope.osothersuitSort = [[ 4, "desc" ]];
        } 
            vm.dtOptions31 = DTOptionsBuilder.newOptions().withOption('bScrollCollapse', true)
              .withOption('bPaginate', false).withOption('bFilter',false).withOption('bDestroy',true)
              .withOption('bAutoWidth',false).withOption('bInfo',false)
              .withOption("order",$scope.osothersuitSort)
              .withOption('drawCallback', function(){
                var sort = "";
                if ($('#landingDataTablefive .landing-data-head-content .sorting_asc').length > 0) {
                    sort = $('#landingDataTablefive th').index($('#landingDataTablefive .landing-data-head-content .sorting_asc')) + ',asc';
                    $scope.osothersuitStr = sort;
                } else if ($('#landingDataTablefive .landing-data-head-content .sorting_desc').length > 0) {
                    sort = $('#landingDataTablefive th').index($('#landingDataTablefive .landing-data-head-content .sorting_desc')) + ',desc';
                    $scope.osothersuitStr = sort;
                }
                 if ("" == $scope.osothersuitStr) {
                                        var temp = $scope.osothersuitSort;
                                        if (null != temp && "" != temp) {
                                            $scope.osothersuitStr = temp;
                                            var indexDtls = $scope.osothersuitStr.split(",");
                                            if ("" != indexDtls[0] && "" != indexDtls[1] && parseInt(indexDtls[0]) <= 6) {
                                                $scope.osothersuitSort = [[parseInt(indexDtls[0]), indexDtls[1]]];
                                            } else {
                                              //agentStr = "5,desc";
                                                $scope.osothersuitSort = [[4, "desc"]];
                                            }
                                        } else {
                                          //agentStr = "5,desc";
                                                $scope.osothersuitSort = [[4, "desc"]];
                                        }
                                    } else {
                                        var indexDtls = $scope.osothersuitStr.split(",");
                                       
                                        $scope.osothersuitSort = [[parseInt(indexDtls[0]), indexDtls[1]]];
                                    }  
                console.log($scope.osothersuitStr);
        BTcommonops.adjustTable();
              });
        $resource('osothersSuitListone.json').query().$promise.then(function(persons) {
            //console.log(persons);
        vm.persons31 = persons;
        });
            }

          }

        }
        
        
$scope.displayTable = function(landingTab){
    
   // vm.dtInstance = vm.dtColumnDefs = vm.dtOptions = vm.dtColumns = {};
    //angular.element(document.querySelector('#tableContainer table')).html('');
    if(landingTab == "notifications"){
        $scope.landingTab = "notifications";
        $scope.osadv = $scope.osadvreq = $scope.osadvsuit = $scope.osother = $scope.osotherreq = $scope.osothersuit = $scope.businesslist=$scope.reqsuittab=false;
        $scope.notify = $scope.deleteNotifyBtn = true;
        $scope.landingHeader = "New Notifications";
        vm.dtOptions1=[];
        //notifylandingController.svcall();
        //vm.dtOptions = DTOptionsBuilder.newOptions();
/*vm.dtOptions = DTOptionsBuilder.fromSource('notificationList.json')
              .withDataProp('NotificationList').withOption('bScrollCollapse', true)
              .withOption('bPaginate', false).withOption('bFilter',false).withOption('bDestroy',true)
              .withOption('bAutoWidth',false).withOption('bInfo',false)
              .withOption("order",[[ 4, "desc" ]])
              .withOption('drawCallback', function(){
                angular.element(document.querySelector('.datatable-wrapper')).removeClass('os_items_reqtable os_items_reqotherstable business-list-table').addClass('notifications-table');
        angular.element(document.querySelector('.datatable-wrapper thead')).addClass('landing-data-head-content');
        angular.element(document.querySelector('.datatable-wrapper thead tr')).removeClass('reqHeader reqothersHeader businessListHeader').addClass('notificationHeader');
        BTcommonops.adjustTable();
              });

        
    
              vm.dtColumnDefs = [
              DTColumnDefBuilder.newColumnDef(6).withTitle('Empty Column').withOption('sDefaultContent', '').notVisible()
              ];
vm.dtColumns = [
        DTColumnBuilder.newColumn('insuredname').withTitle('Insured/Annuitant'),
        DTColumnBuilder.newColumn('contract_no').withTitle('Policy/Contract'),
        DTColumnBuilder.newColumn('contract_plan_desc').withTitle('Product'),
        DTColumnBuilder.newColumn('contract_face_amt').withTitle('Amount($)'),
        DTColumnBuilder.newColumn('contract_stat_date').withTitle('Received Date').renderWith(function(data){
            //console.log(data);
            return BTcommonops.returnFormatDate(data);
        }),
        DTColumnBuilder.newColumn('notification_name').withTitle('Type')
       
    ];*/
   /* vm.dtOptions1 = DTOptionsBuilder.fromFnPromise(function() {
        return $resource('notificationList.json').withDataProp('NotificationList').query().$promise;
    })
    vm.dtOptions1 = DTOptionsBuilder.fromSource('notificationList.json')
              .withDataProp('NotificationList').withOption('bScrollCollapse', true)
              .withOption('bPaginate', false).withOption('bFilter',false).withOption('bDestroy',true)
              .withOption('bAutoWidth',false).withOption('bInfo',false)
              .withOption("order",[[ 4, "desc" ]])
              .withOption('drawCallback', function(){
                angular.element(document.querySelector('.datatable-wrapper')).removeClass('os_items_reqtable os_items_reqotherstable business-list-table').addClass('notifications-table');
        angular.element(document.querySelector('.datatable-wrapper thead')).addClass('landing-data-head-content');
        angular.element(document.querySelector('.datatable-wrapper thead tr')).removeClass('reqHeader reqothersHeader businessListHeader').addClass('notificationHeader');
        BTcommonops.adjustTable();
              });
*/
        
    
             /* vm.dtColumnDefs1 = [
              DTColumnDefBuilder.newColumnDef(6).withTitle('Empty Column').withOption('sDefaultContent', '').notVisible()
              ];*/
/*vm.dtColumns1 = [
        
        DTColumnBuilder.newColumn('contract_stat_date').withTitle('Received Date').renderWith(function(data){
            //console.log(data);
            return BTcommonops.returnFormatDate(data);
        }),
       
       
    ];*/
    //$http.get('notificationList.json').success(function(data){
        //console.log(data);
        vm.persons1 = $resource('notificationListone.json').query();
        if($scope.notificationSort == undefined){
          $scope.notificationSort = [[ 4, "desc" ]];
        } 
        vm.dtOptions1 = DTOptionsBuilder.newOptions().withOption('bScrollCollapse', true)
              .withOption('bPaginate', false).withOption('bFilter',false).withOption('bDestroy',true)
              .withOption('bAutoWidth',false).withOption('bInfo',false)
              .withOption("order",$scope.notificationSort)
              .withOption('drawCallback', function(settings){
                var sort = "";
                if ($('#landingDataTableone .landing-data-head-content .sorting_asc').length > 0) {
                    sort = $('#landingDataTableone th').index($('#landingDataTableone .landing-data-head-content .sorting_asc')) + ',asc';
                    $scope.notificationStr = sort;
                } else if ($('#landingDataTableone .landing-data-head-content .sorting_desc').length > 0) {
                    sort = $('#landingDataTableone th').index($('#landingDataTableone .landing-data-head-content .sorting_desc')) + ',desc';
                    $scope.notificationStr = sort;
                }
                 if ("" == $scope.notificationStr) {
                                        var temp = $scope.notificationSort;
                                        if (null != temp && "" != temp) {
                                            $scope.notificationStr = temp;
                                            var indexDtls = $scope.notificationStr.split(",");
                                            if ("" != indexDtls[0] && "" != indexDtls[1] && parseInt(indexDtls[0]) <= 6) {
                                                $scope.notificationSort = [[parseInt(indexDtls[0]), indexDtls[1]]];
                                            } else {
                                              //agentStr = "5,desc";
                                                $scope.notificationSort = [[4, "desc"]];
                                            }
                                        } else {
                                          //agentStr = "5,desc";
                                                $scope.notificationSort = [[4, "desc"]];
                                        }
                                    } else {
                                        var indexDtls = $scope.notificationStr.split(",");
                                       
                                        $scope.notificationSort = [[parseInt(indexDtls[0]), indexDtls[1]]];
                                    }  
                //console.log($scope.notificationStr);
                //BTcommonops.savesort(notificationStr);
              BTcommonops.adjustTable();
              //$scope.updatetable();
              //console.log($scope);
              //$rootScope.$broadcast('updatetable',{});
              //$scope.notifyTable = true;
              //angular.element('.notifications-table').attr('tablescrolldir','');
              //$compile(angular.element('.notifications-table'))($scope);
              //$scope.$apply();
        });
        
       
    }
    if(landingTab == "advisor"){
        $scope.landingTab = "advisor";
        $scope.notify=$scope.osother=$scope.osotherreq= $scope.osadvsuit=$scope.osothersuit=$scope.businesslist=$scope.deleteNotifyBtn=false;
        $scope.osadv=$scope.osadvreq=$scope.reqsuittab=true;
        $scope.landingHeader = "Outstanding Items - Awaiting Agent Action";
        //vm.dtOptions = DTOptionsBuilder.newOptions();
/*vm.dtOptions = DTOptionsBuilder.fromSource('osadvisorReqList.json')
              .withDataProp('OSReqList').withOption('bScrollCollapse', true)
              .withOption('bPaginate', false).withOption('bFilter',false).withOption('bDestroy',true)
              .withOption('bAutoWidth',false).withOption('bInfo',false)
              .withOption("order",[[ 3, "desc" ]])
              .withOption('drawCallback', function(){
                angular.element(document.querySelector('.datatable-wrapper')).removeClass('notifications-table os_items_reqotherstable business-list-table').addClass('os_items_reqtable');
        angular.element(document.querySelector('thead')).addClass('landing-data-head-content');
        angular.element(document.querySelector('thead tr')).removeClass('notificationHeader reqothersHeader businessListHeader').addClass('reqHeader');
        BTcommonops.adjustTable();
              });
              vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(5).withTitle('Doc Upload Status').withOption('sDefaultContent', ''),
        DTColumnDefBuilder.newColumnDef(6).withTitle('Empty Column').withOption('sDefaultContent', '').notVisible()
    ];

vm.dtColumns = [
        DTColumnBuilder.newColumn('insuredname').withTitle('Insured/Annuitant'),
        DTColumnBuilder.newColumn('contract').withTitle('Policy/Contract'),
        DTColumnBuilder.newColumn('amount').withTitle('Amount($)'),
        DTColumnBuilder.newColumn('daysoutstanding').withTitle('Days Outstanding'),
        DTColumnBuilder.newColumn('requirement').withTitle('Requirement'),
        DTColumnBuilder.newColumn('docstatus').withTitle('Doc Upload Status')
        ];*/
        if($scope.AdvReqSort == undefined){
          $scope.AdvReqSort = [[ 3, "desc" ]];
        } 
        vm.dtOptions2 = DTOptionsBuilder.newOptions().withOption('bScrollCollapse', true)
              .withOption('bPaginate', false).withOption('bFilter',false).withOption('bDestroy',true)
              .withOption('bAutoWidth',false).withOption('bInfo',false)
              .withOption("order",$scope.AdvReqSort)
              .withOption('drawCallback', function(){
                var sort = "";
                if ($('#landingDataTabletwo .landing-data-head-content .sorting_asc').length > 0) {
                    sort = $('#landingDataTabletwo th').index($('#landingDataTabletwo .landing-data-head-content .sorting_asc')) + ',asc';
                    $scope.osadvreqStr = sort;
                } else if ($('#landingDataTabletwo .landing-data-head-content .sorting_desc').length > 0) {
                    sort = $('#landingDataTabletwo th').index($('#landingDataTabletwo .landing-data-head-content .sorting_desc')) + ',desc';
                    $scope.osadvreqStr = sort;
                }
                 if ("" == $scope.osadvreqStr) {
                                        var temp = $scope.AdvReqSort;
                                        if (null != temp && "" != temp) {
                                            $scope.osadvreqStr = temp;
                                            var indexDtls = $scope.osadvreqStr.split(",");
                                            if ("" != indexDtls[0] && "" != indexDtls[1] && parseInt(indexDtls[0]) <= 6) {
                                                $scope.AdvReqSort = [[parseInt(indexDtls[0]), indexDtls[1]]];
                                            } else {
                                              //agentStr = "5,desc";
                                                $scope.AdvReqSort = [[3, "desc"]];
                                            }
                                        } else {
                                          //agentStr = "5,desc";
                                                $scope.AdvReqSort = [[3, "desc"]];
                                        }
                                    } else {
                                        var indexDtls = $scope.osadvreqStr.split(",");
                                       
                                        $scope.AdvReqSort = [[parseInt(indexDtls[0]), indexDtls[1]]];
                                    }  
                console.log($scope.osadvreqStr);
        BTcommonops.adjustTable();
              });
        $resource('osadvisorReqListone.json').query().$promise.then(function(persons) {
            //console.log(persons);
        vm.persons2 = persons;
        //console.log(vm.persons);
    });
        //vm.dtInstance = DTInstances.rerender();
    }
    if(landingTab == "other"){
        $scope.landingTab = "other";
        $scope.notify=$scope.osadv=$scope.osadvreq= $scope.osadvsuit=$scope.osothersuit=$scope.businesslist=$scope.deleteNotifyBtn=false;
        $scope.osother=$scope.osotherreq=$scope.reqsuittab = true;
        $scope.landingHeader = "Outstanding Items - Awaiting Others Action";
       //vm.dtOptions = DTOptionsBuilder.newOptions();
/*vm.dtOptions = DTOptionsBuilder.fromSource('osothersReqList.json')
              .withDataProp('OSReqList').withOption('bScrollCollapse', true)
              .withOption('bPaginate', false).withOption('bFilter',false).withOption('bDestroy',true)
              .withOption('bAutoWidth',false).withOption('bInfo',false)
              .withOption("order",[[ 3, "desc" ]])
              .withOption('drawCallback', function(){
                angular.element(document.querySelector('.datatable-wrapper')).removeClass('notifications-table os_items_reqtable business-list-table').addClass('os_items_reqotherstable');
        angular.element(document.querySelector('thead')).addClass('landing-data-head-content');
        angular.element(document.querySelector('thead tr')).removeClass('notificationHeader reqHeader businessListHeader').addClass('reqothersHeader');
        BTcommonops.adjustTable();
              });
            vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(5).withTitle('Empty Column').withOption('sDefaultContent', '').notVisible(),
        DTColumnDefBuilder.newColumnDef(6).withTitle('Empty Column').withOption('sDefaultContent', '').notVisible()
        
    ];   
vm.dtColumns = [
        DTColumnBuilder.newColumn('insuredname').withTitle('Insured/Annuitant'),
        DTColumnBuilder.newColumn('contract').withTitle('Policy/Contract'),
        DTColumnBuilder.newColumn('amount').withTitle('Amount($)'),
        DTColumnBuilder.newColumn('daysoutstanding').withTitle('Days Outstanding'),
        DTColumnBuilder.newColumn('requirement').withTitle('Requirement')
        
        ];*/
        if($scope.OtherReqSort == undefined){
          $scope.OtherReqSort = [[ 3, "desc" ]];
        } 
        vm.dtOptions3 = DTOptionsBuilder.newOptions().withOption('bScrollCollapse', true)
              .withOption('bPaginate', false).withOption('bFilter',false).withOption('bDestroy',true)
              .withOption('bAutoWidth',false).withOption('bInfo',false)
              .withOption("order",$scope.OtherReqSort)
              .withOption('drawCallback', function(){
                var sort = "";
                if ($('#landingDataTablefour .landing-data-head-content .sorting_asc').length > 0) {
                    sort = $('#landingDataTablefour th').index($('#landingDataTablefour .landing-data-head-content .sorting_asc')) + ',asc';
                    $scope.osotherreqStr = sort;
                } else if ($('#landingDataTablefour .landing-data-head-content .sorting_desc').length > 0) {
                    sort = $('#landingDataTablefour th').index($('#landingDataTablefour .landing-data-head-content .sorting_desc')) + ',desc';
                    $scope.osotherreqStr = sort;
                }
                 if ("" == $scope.osotherreqStr) {
                                        var temp = $scope.OtherReqSort;
                                        if (null != temp && "" != temp) {
                                            $scope.osotherreqStr = temp;
                                            var indexDtls = $scope.osotherreqStr.split(",");
                                            if ("" != indexDtls[0] && "" != indexDtls[1] && parseInt(indexDtls[0]) <= 6) {
                                                $scope.OtherReqSort = [[parseInt(indexDtls[0]), indexDtls[1]]];
                                            } else {
                                              //agentStr = "5,desc";
                                                $scope.OtherReqSort = [[3, "desc"]];
                                            }
                                        } else {
                                          //agentStr = "5,desc";
                                                $scope.OtherReqSort = [[3, "desc"]];
                                        }
                                    } else {
                                        var indexDtls = $scope.osotherreqStr.split(",");
                                       
                                        $scope.OtherReqSort = [[parseInt(indexDtls[0]), indexDtls[1]]];
                                    }  
                console.log($scope.osotherreqStr);
        BTcommonops.adjustTable();
              });
        $resource('osothersReqListone.json').query().$promise.then(function(persons) {
            //console.log(persons);
        vm.persons3 = persons;
        //console.log(vm.persons);
    });
    }
    if(landingTab == "businesslist"){
        $scope.landingTab = "businesslist";

        $scope.notify=$scope.osadv = $scope.osadvreq = $scope.osadvsuit = $scope.osother = $scope.osotherreq = $scope.osothersuit = $scope.deleteNotifyBtn=$scope.reqsuittab=false;
        $scope.businesslist=true;
        $scope.landingHeader = "New Business List";
        //vm.dtOptions = DTOptionsBuilder.newOptions();
/*vm.dtOptions = DTOptionsBuilder.fromSource('newBusinessList.json')
              .withDataProp('NewBusinessList').withOption('bFilter',false).withOption('bScrollCollapse', true)
              .withOption('bPaginate', false).withOption('bDestroy',true)
              .withOption('bAutoWidth',false).withOption('bInfo',false)
              .withOption("order",[[ 3, "desc" ]])
              .withOption('drawCallback', function(){
                angular.element(document.querySelector('.datatable-wrapper')).removeClass('notifications-table os_items_reqtable os_items_reqotherstable').addClass('business-list-table');
        angular.element(document.querySelector('thead')).addClass('landing-data-head-content');
        angular.element(document.querySelector('thead tr')).removeClass('notificationHeader reqHeader reqothersHeader').addClass('businessListHeader');
        BTcommonops.adjustTable();
        
              });
              vm.dtColumnDefs = [];
vm.dtColumns = [
        DTColumnBuilder.newColumn('insuredname').withTitle('Insured/Annuitant'),
        DTColumnBuilder.newColumn('contract_no').withTitle('Policy/Contract'),
        DTColumnBuilder.newColumn('contract_plan_desc').withTitle('Product'),//.withOption('bSearchable',false)
        DTColumnBuilder.newColumn('contract_face_amt').withTitle('Amount($)'),
        DTColumnBuilder.newColumn('app_received_date').withTitle('App Received Date').renderWith(function(data){
            //console.log(data);
            return BTcommonops.returnFormatDate(data);
        }),
        DTColumnBuilder.newColumn('contract_stat_date').withTitle('App Status Change Date').renderWith(function(data){
            //console.log(data);
            return BTcommonops.returnFormatDate(data);
        }),
        DTColumnBuilder.newColumn('type').withTitle('Application Status')
    ];*/
    if($scope.businessSort == undefined){
          $scope.businessSort = [[ 3, "desc" ]];
        }
    vm.dtOptions4 = DTOptionsBuilder.newOptions().withOption('bScrollCollapse', true)
              .withOption('bPaginate', false).withOption('bFilter',false).withOption('bDestroy',true)
              .withOption('bAutoWidth',false).withOption('bInfo',false)
              .withOption("order",$scope.businessSort)
              .withOption('drawCallback', function(){
                //$scope.arr = vm.persons4;
                var sort = "";
                if ($('#landingDataTablesix .landing-data-head-content .sorting_asc').length > 0) {
                    sort = $('#landingDataTablesix th').index($('#landingDataTablesix .landing-data-head-content .sorting_asc')) + ',asc';
                    $scope.businessStr = sort;
                } else if ($('#landingDataTablesix .landing-data-head-content .sorting_desc').length > 0) {
                    sort = $('#landingDataTablesix th').index($('#landingDataTablesix .landing-data-head-content .sorting_desc')) + ',desc';
                    $scope.businessStr = sort;
                }
                 if ("" == $scope.businessStr) {
                                        var temp = $scope.businessSort;
                                        if (null != temp && "" != temp) {
                                            $scope.businessStr = temp;
                                            var indexDtls = $scope.businessStr.split(",");
                                            if ("" != indexDtls[0] && "" != indexDtls[1] && parseInt(indexDtls[0]) <= 6) {
                                                $scope.businessSort = [[parseInt(indexDtls[0]), indexDtls[1]]];
                                            } else {
                                              //agentStr = "5,desc";
                                                $scope.businessSort = [[3, "desc"]];
                                            }
                                        } else {
                                          //agentStr = "5,desc";
                                                $scope.businessSort = [[3, "desc"]];
                                        }
                                    } else {
                                        var indexDtls = $scope.businessStr.split(",");
                                       
                                        $scope.businessSort = [[parseInt(indexDtls[0]), indexDtls[1]]];
                                    }  
                console.log($scope.businessStr);

//console.log($scope.arr);
        BTcommonops.adjustTable();
              });
    $resource('newBusinessListone.json').query().$promise.then(function(persons) {
            //console.log(persons);
        vm.persons4 = persons;

        //console.log(vm.persons);
    });
    /*angular.element(document.querySelector('#policy-search')).on( 'keyup change', function () {
            
            console.log(vm);
            //vm.dtColumnDefs.search( this.value ).draw();
        } );*/
    }
};
$scope.displayTable($location.search().landingTab.toLowerCase());
$scope.navigateAppDet=function(e){
  e.preventDefault();
  $location.path('/appdetails');
}
    /*vm.DTColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).notSortable()
    ];*/
    /*vm.dtOptions = DTOptionsBuilder.fromSource(data.NotificationList)
        .withDOM('lfrti')
        .withScroller()
        .withOption('deferRender', true)
        // Do not forget to add the scorllY option!!!
        .withOption('scrollY', 200);
    vm.dtColumns = [
        DTColumnBuilder.newColumn('insuredname').withTitle('ID'),
        DTColumnBuilder.newColumn('contract_no').withTitle('First name'),
        DTColumnBuilder.newColumn('notification_name').withTitle('Last name')
    ];*/
        //})
    }]);

    scotchApp.controller('contactController', function($scope) {
      $scope.message = 'Contact us! JK. This is just a demo.';
    });

    scotchApp.controller('appDetailsController',['$scope','$rootScope','$controller','$filter','$window','$http','$location','$resource','BTAjaxservice','BTcommonops',
                                              'DTOptionsBuilder','DTColumnBuilder','DTColumnDefBuilder','DTInstances',
                                               function($scope,$rootScope,$controller,$filter,$window,$http,$location,$resource,BTAjaxservice,BTcommonops,DTOptionsBuilder,DTColumnBuilder,DTColumnDefBuilder,DTInstances) {
                                               //$scope.appdata = [];

                                               $scope.callappdata = function(){
                                                BTAjaxservice.getservices().getAppdetails($scope.getappdet);
                                               }
                                               
                                               $scope.getappdet = function(data){
                                                $scope.appdata = JSON.parse(data);

                                                //$scope.polval = $scope.appdata.ApplicationDetails.ApplicationInformation.ContractNo;
                                                console.log($scope.appdata);
                                                //console.log($scope.polval);
                                                $scope.$apply();
                                                //console.log(JSON.parse($scope.appdata));
                                               }

                                               $scope.callappdata();
                                              // $scope.appdata = $resource('appdetailone.json').query();
                                               /*$resource('appdetailone.json').query().$promise.then(function(persons) {
                                                $scope.appdata = persons;
                                               })*/
                                               
    }])