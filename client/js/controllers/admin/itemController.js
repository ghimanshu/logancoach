lcControllers.controller('itemCtrl', ['$scope','$rootScope', '$modal', '$compile', 'ItemService', 'CategoryService',
  function($scope,$rootScope, $modal, $compile, ItemService, CategoryService) {
    adminScopeInit($scope);
    $rootScope.showHeader = true;
    $scope.active = 'item';
    $scope.selectedSuperCategoryId = "1";

    CategoryService.getSuperCategories(function (result) {
      $scope.superCategories = result;
      CategoryService.getAllCategories(function (result) {
        $scope.superCategories.forEach(function(supercategory) {
          supercategory.categories = [];
        });
        result.forEach(function(category){
          $scope.superCategories[category.superId - 1].categories.push(category);
        });
      });
    });

    $scope.editItems = function(category) {
        var modalInstance = $modal.open({
          templateUrl: 'partials/modal/itemsModal.html',
          controller: 'itemsModalCtrl',
          size: "lg"
        });
        modalInstance.category = category;
    };

    $scope.addCategory = function(newCategory) {
      CategoryService.addCategory(newCategory, function success(value) {
        $scope.superCategories[newCategory.superId-1].categories.push(newCategory)
        $scope.newCategory = null
      });
    };

    $scope.updateCategory = function(category) {
      CategoryService.updateCategory(category.categoryId, category, function onSuccess(result) {

      });
    };
  }
]);

lcControllers.controller('itemsModalCtrl', function($scope, $modalInstance, ItemService) {
  $scope.newItem = {
    save: "Add Item",
    defaultPrice: 0,
    itemName: "",
    itemDescription: ""
  };

  $scope.category = $modalInstance.category

  ItemService.getItemsByCategoryId($scope.category.categoryId, function onSuccess(result) {
    $scope.items = result;
  });

  $scope.updateItem = function(item) {
    ItemService.updateItem(item.itemId, item, function onSuccess(result) {

    });
  };

  $scope.saveNewItem = function() {
    $scope.newItem.categoryId = $scope.category.categoryId;
    $scope.newItem.rank = $scope.items.length;
    ItemService.saveNewItem($scope.newItem, function onSuccess(result) {
      $scope.newItem.itemId = result;
      $scope.items.push($scope.newItem);
      $scope.newItem = {
        defaultPrice: 0,
        itemName: "",
        itemDescription: ""
      };
    });
  };

  $scope.save = function() {
    $scope.newCategory.categoryId = $scope.selectedSuperCat.superId;
    $modalInstance.close($scope.newCategory);
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
