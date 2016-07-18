lcControllers.controller('estimateConfigCtrl', ['$scope', '$http', '$modal', '$routeParams', '$window', 'EstimateService', 'TrailerService', 'UserService',
  function($scope, $http, $modal, $routeParams, $window, EstimateService, TrailerService, UserService) {
    if (!$scope.dealerName) {
      UserService.getDealershipName(function(result){
        $scope.dealerName = result;
      });
    }
    if ($routeParams.id < 0) {
      $scope.isAdmin = true;
      adminScopeInit($scope);
    } else {
      $scope.isAdmin = false;
      dealerScopeInit($scope);
    }
    $scope.hasLivingQuarters = false;
    $scope.livingQuarterPackage = "None";
    $scope.widthCost = 0;
    $scope.heightCost = 0;

    $scope.alerts = [
      // { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
      // { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
    ];


    $scope.selectCategory = function(superid) {
      $scope.selectedSuperCategory = superid;
    }

    $scope.goback = function() {
      $window.history.back();
    }

    $scope.canSubmit = false;

    EstimateService.getConfiguration($routeParams.id, function (result) {
      $scope.curEstimate = result.data;
      $scope.specialRequests = result.specialRequests || [];
      // console.log(result);
      $scope.trailerId = $scope.curEstimate[0].categories[0].items[0].trailerId;

      $scope.visibleCategories = $scope.curEstimate.map(function(supercategory){
        return supercategory.id
      });
      $scope.selectedSuperCategory = $scope.visibleCategories[0];

      TrailerService.getById($scope.trailerId, function(result) {
        $scope.baseCost = result[0].trailerCost;
        EstimateService.getExclusions(Math.abs($scope.trailerId), function (res) {
          $scope.exclusions = res;
          $scope.allCategories = $scope.curEstimate.reduce(function(a, b) {
            return a.concat(b.categories);
          }, []);

          $scope.allCategoriesMap = {};
          $scope.allCategories.forEach(function(cat) {
            $scope.allCategoriesMap[cat.id] = cat;
          });

          $scope.allItemsArray = $scope.allCategories.reduce(function(a, b) {
            return a.concat(b.items);
          }, []);

          //select item if category has only one item
          $scope.allCategories.forEach(function(category){
            if (category.items[0].isMultiSelect === 'false' && !category.optional && category.items.length == 1) {
              category.selectedItem = category.items[0];
            }
          });

          $scope.allItemsMap = {};
          $scope.allItemsArray.forEach(function(item) {
            $scope.allItemsMap[item.itemId] = item;
          });

          for (var itemId in $scope.exclusions) {
            //TODO: this line used to have an undefined error for $scope.allItemsMap[itemId].exclusions find out if this hack broke anything
            //apparently exclusions are completely broken here...
            if ($scope.exclusions.hasOwnProperty(itemId) && $scope.allItemsMap[itemId]) {
              $scope.allItemsMap[itemId].exclusions = $scope.exclusions[itemId];
            }
          }
          $scope.initializeConfig();

          // $scope.validateExclusions();
          $scope.additionalTrailerLength = $scope.getSelectedItems().reduce(function(prev,curr){
            return prev + curr.lengthAdded;
          }, 0);

          $scope.checkForLivingQuarters();

          $scope.getSelectedItems().forEach(function(item){
            if (item.categoryName.startsWith("Box Width" + $scope.trailertypestring)) {
              if(item.itemCost != 0) {
                $scope.widthCost = item.itemCost;
              }
              // console.log("width", item.itemCost, $scope.additionalTrailerLength);
            } else if (item.categoryName.startsWith("Box Height" + $scope.trailertypestring)){
              if(item.itemCost != 0) {
                $scope.heightCost = item.itemCost;
              }
              // console.log("height", item.itemCost, $scope.additionalTrailerLength);
            }
          });

          $scope.totalCost = $scope.getTrailerCostAsConfigured();
        });
      });
    });

    $scope.superCategoryVisible = function(supername) {
      if (!supername.startsWith('Living Quarter')) return true;
      if (!$scope.hasLivingQuarters) return false;
      return supername.substring(17).startsWith($scope.livingQuarterPackage) || supername == "Living Quarter - General Features"
    }

    $scope.cleanedName = function(supername) {
      if (supername.startsWith('Living Quarter')) {
        return "LQ " + supername.substring(17)
      } else {
        return supername
      }
    };

    $scope.itemCount = function(categories) {
      var unselected = 0
      var count = categories.filter(function(category){
        if (category.selectedItem) {
          return category.selectedItem.itemCost > 0;
        } else {
          unselected += 1
        }
      }).length
      // console.log(unselected, "items are not selected")
      return (count == 0) ? "" : count;
    };

    $scope.checkForLivingQuarters = function() {
      if ($scope.allCategoriesMap[2131] == undefined) {
        return false
      }
      var livingQuarters = true;
      var livingQuarterPackage = $scope.allCategoriesMap[2131].selectedItem.itemName.replace("Trim", "");

      livingQuarters = livingQuarterPackage != "None"

      if (livingQuarterPackage.indexOf("Wide") != -1) {
        $scope.livingQuarterPackage = livingQuarterPackage.substring(livingQuarterPackage.indexOf("Wide")+5, livingQuarterPackage.indexOf("Pk")).trim()
      }

      $scope.hasLivingQuarters = livingQuarters;
      $scope.trailertypestring = livingQuarters ? " - Living Quarter" : " - Standard";
      return livingQuarters;
    };

    $scope.initializeConfig = function() {
      // $scope.validateEverything();
      $scope.allItemsArray.forEach(function(item) {
        if (item.isMultiSelect === 'true' && (item.quantity === null || item.quantity === undefined)) {
          item.quantity = item.standardQuantity;
        }
      });
    };

    $scope.getSelectedItems = function() {
      return $scope.allCategories.reduce(function(last, cur) {
        // console.log(cur);
        cur.alerts = [];
        if (cur.selectedItem !== undefined && cur.selectedItem !== null) {
          last.push(cur.selectedItem);
        } else if (cur.items[0].isMultiSelect === 'true') {
          last.concat(cur.items.reduce(function(lastArray, curItem) {
            if (curItem.quantity > 0) {
              last.push(curItem);
            }
            return lastArray;
          }, []));
        }
        return last;
      }, []);
    };

    $scope.getTrailerCostAsConfigured = function() {
      return $scope.getSelectedItems().reduce(function(totalCost, item) {
        if (item.isMultiSelect === 'true') {
          totalCost += item.itemCost * item.quantity;
        } else {
          totalCost += item.itemCost;
        }
        return totalCost;
      }, $scope.baseCost) + $scope.widthCost * $scope.additionalTrailerLength + $scope.heightCost * $scope.additionalTrailerLength
      + $scope.specialRequests.reduce(function(total, item){return total + item.cost;}, 0);
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.validateExclusions = function(itemToCheck) {
      //so that it won't break if the item is null
      //this is necessary for eventually allowing optional categories
      // if(!itemToCheck) return;

      $scope.checkForLivingQuarters();
      // $scope.trailertypestring = $scope.checkForLivingQuarters() ? " - Living Quarter" : " - Standard";

      $scope.additionalTrailerLength = $scope.getSelectedItems().reduce(function(prev,curr){
        return prev + curr.lengthAdded;
      }, 0);

      if(itemToCheck.categoryName.startsWith("Box Width" + $scope.trailertypestring)) {
        // console.log('Width');
        $scope.widthCost = itemToCheck.itemCost;
      }

      if(itemToCheck.categoryName.startsWith("Box Height" + $scope.trailertypestring)) {
        // console.log('height');
        $scope.heightCost = itemToCheck.itemCost;
      }

      var modifiedItems = [];
      if (itemToCheck.exclusions) {
        itemToCheck.exclusions.forEach(function(exclusion) {
          if ($scope.allItemsMap[exclusion]) {
            $scope.curEstimate.forEach(function(supercategory) {
              supercategory.categories.forEach(function(category) {

                category.items.forEach(function(item) {
                  if (item.itemId == exclusion) {
                    if(item.isMultiSelect === 'false') {
                      category.items.forEach(function(otherItem) {
                        otherItem.selected = false;
                      });
                    } else {
                      console.log("category, is multiselect and has overridden items. Not sure how to handle that");
                    }

                    category.selectedItem = item;
                    item.selected = true;

                    modifiedItems.push(exclusion);
                  }
                });
              });
            });
          } else {
            console.log("override requested for", exclusion, "but item isn't an option on this trailer");
          }
        });
          $scope.alerts.push({
            // msg: itemToCheck.itemName + " recommends: \n\n " + modifiedItems.map(function(item){return $scope.allItemsMap[item].itemName}).join(', ') + ", \n\nconfiguration has been updated accordingly.",
            msg: itemToCheck.itemName + " recommends " + modifiedItems.length + " items, they have been autoselected",
            type: "info"
          });
          // setTimeout(function(){
          //   $scope.$apply(function() {$scope.closeAlert(0);});
          // }, 4000);
      }

      $scope.totalCost = $scope.getTrailerCostAsConfigured();
      $scope.canSubmit = true;

    };

    // $scope.hasExcludedItems = function(category) {
    //   for (var i = 0; i < category.items.length; ++i) {
    //     if (!category.items[i].canSelect) {
    //       return true;
    //     }
    //   }
    // };

    // $scope.getAlertMessages = function(category) {
    //   return category.items.filter(function(item) {
    //     return !item.canSelect;
    //   }).map(function(val) {
    //     return val.alert;
    //   });
    // };

    $scope.missingSelection = function(category) {
      if (category.optional === false && category.selectedItem === null || category.selectedItem === undefined) {
        return true;
      }
      return false;
    };

    $scope.validateEverything = function() {
      $scope.curEstimate.forEach(function(supercategory) {
        supercategory.categories.forEach(function(category) {
          if ($scope.missingSelection(category) && !$scope.hasLivingQuarters && !category.name.startsWith("LQ")){
            // console.log(category.name, "is unselected")
          }
        });
      });
    }
    $scope.savingText = "Save"
    $scope.save = function() {
      $scope.savingText = "Saving..."
      $scope.validateEverything();
      var estimate = {
        // configuration: $scope.curEstimate,
        specialRequests: $scope.specialRequests,
        estimateId: $routeParams.id,
        configuredCost: $scope.totalCost,
        selectedItems: $scope.getSelectedItems()
      };

      EstimateService.addConfiguration(estimate, function (data) {
        $scope.alerts.push({
          msg: "Saved: " + new Date(Date.now()).toLocaleString(),
          type: "success"
        });
        $scope.savingText = "Save"
      });
    };
    $scope.saveAndReturn = function() {
      $scope.validateEverything();
      var estimate = {
        // configuration: $scope.curEstimate,
        specialRequests: $scope.specialRequests,
        estimateId: $routeParams.id,
        configuredCost: $scope.totalCost,
        selectedItems: $scope.getSelectedItems()
      };

      EstimateService.addConfiguration(estimate, function (data) {
        window.location.href = '#/dealer/estimates/' + $routeParams.id;
        // console.log(data);
      });
    };

    $scope.print = function() {
      console.log($scope.curEstimate);
    };

    $scope.selectActiveItem = function(category) {
      for (var i = 0; i < category.items.length; ++i) {
        if (category.items[i].selected === 'true') {
          category.selectedItem = category.items[i];
          return;
        }
      }
    };

    $scope.setQuantity = function(item) {
      if (item.quantity === null) {
        item.quantity = item.standardQuantity;
      }
    };

    $scope.addNewSpecialRequest = function() {
      if ($scope.specialRequests === null || $scope.specialRequests === undefined) {
        $scope.specialRequests = [];
      }
      $scope.specialRequests.push({
        description: $scope.newSpecialRequest.description,
        cost: $scope.newSpecialRequest.cost
      });
      $scope.newSpecialRequest = {};
      $scope.totalCost = $scope.getTrailerCostAsConfigured();
    };

    $scope.deleteRequest = function(request) {
      $scope.specialRequests.splice($scope.specialRequests.indexOf(request), 1);
      $scope.totalCost = $scope.getTrailerCostAsConfigured();
    };

    $scope.disableAddSpecialRequestButton = function(value) {
      if (value === undefined || value === null) {
        return true;
      }
      if (value.description === null || value.description === undefined || value === '') {
        return true;
      }
      if (value.cost === null || value.cost === undefined || value.cost.toString().match('\\d+') === null) {
        return true;
      }
      return false;

    };
  }
]);
