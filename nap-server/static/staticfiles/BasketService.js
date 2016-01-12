
// Provide a default path to dwr.engine
if (dwr == null) var dwr = {};
if (dwr.engine == null) dwr.engine = {};
if (DWREngine == null) var DWREngine = dwr.engine;

if (BasketService == null) var BasketService = {};
BasketService._path = '/intl/dwr';
BasketService.addSkusToBasket = function(p0, callback) {
  dwr.engine._execute(BasketService._path, 'BasketService', 'addSkusToBasket', p0, callback);
}
BasketService.addReservedProductToBasket = function(p0, p1, callback) {
  dwr.engine._execute(BasketService._path, 'BasketService', 'addReservedProductToBasket', p0, p1, callback);
}
BasketService.addSkuToBasket = function(p0, callback) {
  dwr.engine._execute(BasketService._path, 'BasketService', 'addSkuToBasket', p0, callback);
}
