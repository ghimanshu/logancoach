lcControllers.controller('trailerConfigCtrl', ['$scope', '$routeParams', '$modal', '$window', 'TrailerService', 'TrailerConfigService',
  function($scope, $routeParams, $modal, $window, TrailerService, TrailerConfigService) {
    adminScopeInit($scope);

    $scope.overrides = [];
    $scope.categoryopenstatus = [];
    $scope.currentlyActive = "Living Quarter";
    $scope.selectedItemForCopy = null;
    $scope.selectedItemForCopyText = "Select";

    $scope.selectItemForCopy = function(item) {
      // console.log(item);
      // console.log($scope.selectedItemForCopy);
      if($scope.selectedItemForCopy === null) {
        $scope.selectedItemForCopyText = "Copy from " + item.itemName;
        $scope.selectedItemForCopy = item;
      } else if(item == null) {
        $scope.selectedItemForCopyText = "Select";
        $scope.selectedItemForCopy = item;
      } else {
        $scope.selectedItemForCopy.exclusions.forEach(function(override){
          if(item.exclusions) {
            if(item.exclusions.filter(function(exclusion){return exclusion.itemId == override.itemId}).length == 0) {
              item.exclusions.push(override);
              $scope.overrides.push({item:item, override:override});
            } else {
              console.log("duplicate override found and ignored");
            }
          } else {
            $scope.overrides.push({item:item, override:override});
            item.exclusions = [override];
          }
        });
        $scope.selectedItemForCopyText = "Select";
        $scope.selectedItemForCopy = null;
      }
    }

    $scope.makeActive = function(categoryname) {
      if(categoryname !== $scope.currentlyActive) {
        $scope.categoryopenstatus[categoryname] = true;
        $scope.categoryopenstatus[$scope.currentlyActive] = false;
        $scope.currentlyActive = categoryname;
      }
    };

    TrailerConfigService.getOptions($routeParams.id, function (result) {
      $scope.config = result;
      $scope.initializeConfig();
      $scope.validate($scope.config);
    });

    TrailerService.getById($routeParams.id, function (result) {
      $scope.trailer = result[0];
    });

    $scope.initializeConfig = function() {
      $scope.getCategoriesAsArray($scope.config).forEach(function(category) {
        $scope.categoryopenstatus[category.name] = category.name === "Living Quarter";
        category.valid = true;
        category.isOpen = true;
        category.items.forEach(function(item) {
          if(item.exclusions) {
            item.exclusions.forEach(function(override){
              $scope.overrides.push({item: item, override: override});
            });
          }
          item.validCost = true;
          if (item.standardQuantity === -1) {
            category.optional = true;
          }
        });
      });
    };

    $scope.savingLabel = "Save";
    $scope.save = function() {
      $scope.iterate($scope.config);
      $scope.savingLabel = "Validating...";
      if ($scope.validate($scope.config) === true) {
        $scope.savingLabel = "Saving...";

        TrailerConfigService.save($routeParams.id, $scope.config, function (result) {
          $scope.savingLabel = "Save";
        });
      }
    };

    $scope.saveAndReturn = function() {
      $scope.iterate($scope.config);
      if ($scope.validate($scope.config) === true) {
        TrailerConfigService.save($routeParams.id, $scope.config, function (result) {
          $window.location.href = '#/admin/trailers/' + $routeParams.id;
        });
      }
    };

    $scope.validate = function(config) {
      var valid = true;
      var categories = $scope.getCategoriesAsArray(config);
      categories.forEach(function(category) {
        valid = valid && $scope.validateCategory(category);
      });
      return valid;
    };

    $scope.validateCategory = function(category) {
      category.errorMessage = "";
      if (category.items[0].isMultiSelect === 'true') {
        return $scope.validateMultiselect(category);
      } else if (category.optional === true) {
        return $scope.validateSingleSelectOptional(category);
      } else if (category.optional === false) {
        return $scope.validateSingleSelectRequired(category);
      }
    };

    $scope.validateCost = function(item) {
      item.validCost = !isNaN(item.itemCost);
    };

    $scope.validateMultiselectItem = function(item) {
      return item.standardQuantity > item.maxQuantity;
    };

    $scope.validateMultiselect = function(category) {
      var items = category.items;

      for (var i = 0; i < items.length; i++) {
        var cur = items[i];
        if (!cur.validCost) {
          category.valid = false;
          category.errorMessage += "At Least One cost is invalid";
          return false;
        } else if (cur.available === 'true' && $scope.validateMultiselectItem(cur)) {
          category.errorMessage = "StandarQuantity must be greater than the Max Quantity"
          category.valid = false;
          return false;
        }
      }
      category.valid = true;
      return true;

    };

    $scope.allCategoriesValid = function() {
      var valid = true;
      if ($scope.config !== undefined)
        $scope.getCategoriesAsArray($scope.config).forEach(function(category) {
          valid = valid && category.valid;
        });
      return valid;
    }

    $scope.makeAvailable = function(item) {
      item.available = 'true';
    };

    $scope.validateSingleSelectRequired = function(category) {
      //cost is blank or a number no letters
      //if nothing available and no standard then it is valid
      //standard item is available

      var items = category.items;

      var hasStandard = false;
      var standardAvailable = false;
      var hasAvailable = false;

      for (var i = 0; i < items.length; i++) {
        var cur = items[i];
        if (!cur.validCost) {
          category.errorMessage = "At Least One cost is invalid";
          category.valid = false;
          return false;
        }
        if (cur.available === 'true') {
          hasAvailable = true;
        }
        if (cur.itemId === category.standardItemId && cur.available === 'true') {
          standardAvailable = true;
        }
        if (cur.standard === 'true') {
          hasStandard = true;
        }
      }
      if (standardAvailable === true) {
        category.valid = true;
        return true;
      }
      if (hasAvailable === false && hasStandard === true) {
        category.valid = true;
        return true;
      }
      if (hasAvailable === true && hasStandard === false) {
        category.errorMessage = "The standard item must be available";
        category.valid = false;
        return false;
      }
      if (hasAvailable === true && hasStandard === true) {
        category.errorMessage = "A standard item must be selected for required categories";
        category.valid = false;
        return false;
      }
      category.valid = true;
      return true;

    };

    $scope.validateSingleSelectOptional = function(category) {
      //cost is blank or a number no letters
      //available if standard is selected

      var items = category.items;
      var hasStandard = false;
      var standardAvailable = false;
      for (var i = 0; i < items.length; i++) {
        var cur = items[i];
        if (!cur.validCost) {
          category.errorMessage = "At Least One cost is invalid";
          category.valid = false;
          return false;
        }
        if (cur.standard === 'true') {
          hasStandard = true;
        }
        if (cur.available === 'true' && cur.standard === 'true') {
          standardAvailable = true;
        }
      }
      if (standardAvailable) {
        category.valid = true;
        return true;
      }
      if (hasStandard) {
        category.errorMessage = "The Standard Item must be available";
        category.valid = false;
        return false;
      }
      category.valid = true;
      return true;
    };

    $scope.getCategoriesAsArray = function(config) {
      return config.reduce(function(left, category) {
        return left.concat(category.categories);
      }, []);
    };

    $scope.print = function() {
      $scope.iterate($scope.config);
      console.log($scope.config);
    };

    //What is this??
    $scope.not = function(value) {
      console.log(value);
    };

    //And this?
    $scope.getValue = function(item) {
      console.log(item);
      return "hello";
    };

    $scope.getEnabled = function(value) {
      if (value === "false") {
        return 'Disabled';
      } else if (value === 'true') {
        return "Enabled";
      }
      return 'unknown';
    };

    $scope.toggleCollapseAccordion = function() {
      var value = $scope.config;
      $scope.allAccordionOpen = !$scope.allAccordionOpen;
      for (var i = 0; i < value.length; ++i) {
        var curSuper = value[i];
        for (var j = 0; j < curSuper.categories.length; ++j) {
          var curCat = curSuper.categories[j];
          curCat.isOpen = !$scope.allAccordionOpen;
        }
      }
    };

    $scope.iterate = function(value) {
      for (var i = 0; i < value.length; ++i) {
        var curSuper = value[i];
        for (var j = 0; j < curSuper.categories.length; ++j) {
          var curCat = curSuper.categories[j];
          for (var k = 0; k < curCat.items.length; ++k) {
            if (curCat.optional === true && curCat.items[k].isMultiSelect === 'false') {
              curCat.items[k].standardQuantity = -1;
            } else if (curCat.optional === false && curCat.items[k].isMultiSelect === 'false') {
              curCat.items[k].standardQuantity = 0;
            }
            if (curCat.items[k].itemId === curCat.standardItemId) {
              curCat.items[k].standard = 'true';
            } else {
              curCat.items[k].standard = 'false';
            }
          }
        }
      }
    };

    $scope.showCopyModal = function(category) {
      var modalInstance = $modal.open({
        templateUrl: 'partials/modal/copyModal.html',
        controller: 'copyModalCtrl',
        size: "md"

      });
      modalInstance.category = category;
      modalInstance.trailer = $scope.trailer;
      modalInstance.result.then(
        function onModalClose(val) {
          $scope.overrides = $scope.overrides.concat(val.map(function(override){return{item: null, override: override}}));
        },
        function onModalDismiss(val) {
          // console.log("dismissed");
        });
    };

    $scope.showItemCopyModal = function(item) {
      var modalInstance = $modal.open({
        templateUrl: 'partials/modal/copyModal.html',
        controller: 'copyModalCtrl',
        size: "md"
      });
      modalInstance.item = item;
      modalInstance.trailer = $scope.trailer;
      modalInstance.result.then(
        function onModalClose(val) {
          $scope.overrides = $scope.overrides.concat(val.map(function(override){return{item: null, override: override}}));
        },
        function onModalDismiss(val) {
          // console.log("dismissed");
        });
    };

    $scope.configureExclusions = function(item) {
      var modalInstance = $modal.open({
        templateUrl: 'partials/modal/configureExclusionsModal.html',
        controller: 'exclusionModalCtrl',
        size: "lg"
      });
      modalInstance.item = item;
      modalInstance.result.then(
        function onModalClose(val) {
          val.removed.forEach(function(override){
            var toRemove = $scope.overrides.filter(function(exclusion){return exclusion.override.itemId == override.itemId})[0];
            var index = $scope.overrides.indexOf(toRemove);
            if (index > -1) {
              $scope.overrides.splice(index, 1);
            }
          });
          val.added.forEach(function(override){
              $scope.overrides.push({item: item, override: override});
          });
        },
        function onModalDismiss(val) {
          // console.log("dismissed");
        });
    };

    $scope.disableOtherBoxes = function(category, selected) {
      var items = category.items.filter(function(item) {
        if (item.standard === 'true') {
          return true;
        }
        return false;
      });
      if (items.length === 1) {
        category.lastStandard = selected;
        selected.available = 'true';
        category.standardItemId = selected.itemId;
        return;
      }
      for (var i = 0; i < items.length; i++) {
        items[i].standard = 'false';
      }
      if (category.lastStandard === selected) {
        selected.standard = 'false';
        category.standardItemId = null;
        category.lastStandard = null;
      } else {
        category.lastStandard = selected;
        selected.standard = 'true';
        category.standardItemId = selected.itemId;
        selected.available = 'true';
      }
    };
  }
]);
