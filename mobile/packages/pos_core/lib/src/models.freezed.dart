// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'models.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$CategoryView {

 String get id; String get name; bool get active;
/// Create a copy of CategoryView
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CategoryViewCopyWith<CategoryView> get copyWith => _$CategoryViewCopyWithImpl<CategoryView>(this as CategoryView, _$identity);



@override
bool operator ==(Object other) {
  final _this = this as CategoryView;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CategoryView&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.active, _this.active) || other.active == _this.active));
}


@override
int get hashCode {
  final _this = this as CategoryView;
  return Object.hash(runtimeType,_this.id,_this.name,_this.active);
}

@override
String toString() {
  final _this = this as CategoryView;
  return 'CategoryView(id: ${_this.id}, name: ${_this.name}, active: ${_this.active})';
}


}

/// @nodoc
abstract mixin class $CategoryViewCopyWith<$Res>  {
  factory $CategoryViewCopyWith(CategoryView value, $Res Function(CategoryView) _then) = _$CategoryViewCopyWithImpl;
@useResult
$Res call({
 String id, String name, bool active
});




}
/// @nodoc
class _$CategoryViewCopyWithImpl<$Res>
    implements $CategoryViewCopyWith<$Res> {
  _$CategoryViewCopyWithImpl(this._self, this._then);

  final CategoryView _self;
  final $Res Function(CategoryView) _then;

/// Create a copy of CategoryView
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? active = null,}) {
  return _then(CategoryView(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,active: null == active ? _self.active : active // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [CategoryView].
extension CategoryViewPatterns on CategoryView {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CategoryView value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CategoryView() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CategoryView value)  $default,){
final _that = this;
switch (_that) {
case _CategoryView():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CategoryView value)?  $default,){
final _that = this;
switch (_that) {
case _CategoryView() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  bool active)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CategoryView() when $default != null:
return $default(_that.id,_that.name,_that.active);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  bool active)  $default,) {final _that = this;
switch (_that) {
case _CategoryView():
return $default(_that.id,_that.name,_that.active);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  bool active)?  $default,) {final _that = this;
switch (_that) {
case _CategoryView() when $default != null:
return $default(_that.id,_that.name,_that.active);case _:
  return null;

}
}

}

/// @nodoc


class _CategoryView implements CategoryView {
  const _CategoryView({required this.id, required this.name, this.active = true});
  

@override final  String id;
@override final  String name;
@override@JsonKey() final  bool active;

/// Create a copy of CategoryView
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CategoryViewCopyWith<_CategoryView> get copyWith => __$CategoryViewCopyWithImpl<_CategoryView>(this, _$identity);



@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _CategoryView&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.active, active) || other.active == active));
}


@override
int get hashCode {
    return Object.hash(runtimeType,id,name,active);
}

@override
String toString() {
    return 'CategoryView(id: $id, name: $name, active: $active)';
}


}

/// @nodoc
abstract mixin class _$CategoryViewCopyWith<$Res> implements $CategoryViewCopyWith<$Res> {
  factory _$CategoryViewCopyWith(_CategoryView value, $Res Function(_CategoryView) _then) = __$CategoryViewCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, bool active
});




}
/// @nodoc
class __$CategoryViewCopyWithImpl<$Res>
    implements _$CategoryViewCopyWith<$Res> {
  __$CategoryViewCopyWithImpl(this._self, this._then);

  final _CategoryView _self;
  final $Res Function(_CategoryView) _then;

/// Create a copy of CategoryView
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? active = null,}) {
  return _then(_CategoryView(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,active: null == active ? _self.active : active // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}

/// @nodoc
mixin _$ProductView {

 String get id; String get name; int get price; String get categoryId; String get categoryName; String? get sku; String? get photoPath; int get stock; int get minStock; bool get active;/// Produk yang sudah pernah terjual hanya bisa dinonaktifkan, tidak dihapus.
 bool get hasSales;
/// Create a copy of ProductView
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ProductViewCopyWith<ProductView> get copyWith => _$ProductViewCopyWithImpl<ProductView>(this as ProductView, _$identity);



@override
bool operator ==(Object other) {
  final _this = this as ProductView;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ProductView&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.price, _this.price) || other.price == _this.price)&&(identical(other.categoryId, _this.categoryId) || other.categoryId == _this.categoryId)&&(identical(other.categoryName, _this.categoryName) || other.categoryName == _this.categoryName)&&(identical(other.sku, _this.sku) || other.sku == _this.sku)&&(identical(other.photoPath, _this.photoPath) || other.photoPath == _this.photoPath)&&(identical(other.stock, _this.stock) || other.stock == _this.stock)&&(identical(other.minStock, _this.minStock) || other.minStock == _this.minStock)&&(identical(other.active, _this.active) || other.active == _this.active)&&(identical(other.hasSales, _this.hasSales) || other.hasSales == _this.hasSales));
}


@override
int get hashCode {
  final _this = this as ProductView;
  return Object.hash(runtimeType,_this.id,_this.name,_this.price,_this.categoryId,_this.categoryName,_this.sku,_this.photoPath,_this.stock,_this.minStock,_this.active,_this.hasSales);
}

@override
String toString() {
  final _this = this as ProductView;
  return 'ProductView(id: ${_this.id}, name: ${_this.name}, price: ${_this.price}, categoryId: ${_this.categoryId}, categoryName: ${_this.categoryName}, sku: ${_this.sku}, photoPath: ${_this.photoPath}, stock: ${_this.stock}, minStock: ${_this.minStock}, active: ${_this.active}, hasSales: ${_this.hasSales})';
}


}

/// @nodoc
abstract mixin class $ProductViewCopyWith<$Res>  {
  factory $ProductViewCopyWith(ProductView value, $Res Function(ProductView) _then) = _$ProductViewCopyWithImpl;
@useResult
$Res call({
 String id, String name, int price, String categoryId, String categoryName, String? sku, String? photoPath, int stock, int minStock, bool active, bool hasSales
});




}
/// @nodoc
class _$ProductViewCopyWithImpl<$Res>
    implements $ProductViewCopyWith<$Res> {
  _$ProductViewCopyWithImpl(this._self, this._then);

  final ProductView _self;
  final $Res Function(ProductView) _then;

/// Create a copy of ProductView
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? price = null,Object? categoryId = null,Object? categoryName = null,Object? sku = freezed,Object? photoPath = freezed,Object? stock = null,Object? minStock = null,Object? active = null,Object? hasSales = null,}) {
  return _then(ProductView(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as int,categoryId: null == categoryId ? _self.categoryId : categoryId // ignore: cast_nullable_to_non_nullable
as String,categoryName: null == categoryName ? _self.categoryName : categoryName // ignore: cast_nullable_to_non_nullable
as String,sku: freezed == sku ? _self.sku : sku // ignore: cast_nullable_to_non_nullable
as String?,photoPath: freezed == photoPath ? _self.photoPath : photoPath // ignore: cast_nullable_to_non_nullable
as String?,stock: null == stock ? _self.stock : stock // ignore: cast_nullable_to_non_nullable
as int,minStock: null == minStock ? _self.minStock : minStock // ignore: cast_nullable_to_non_nullable
as int,active: null == active ? _self.active : active // ignore: cast_nullable_to_non_nullable
as bool,hasSales: null == hasSales ? _self.hasSales : hasSales // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [ProductView].
extension ProductViewPatterns on ProductView {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ProductView value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ProductView() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ProductView value)  $default,){
final _that = this;
switch (_that) {
case _ProductView():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ProductView value)?  $default,){
final _that = this;
switch (_that) {
case _ProductView() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  int price,  String categoryId,  String categoryName,  String? sku,  String? photoPath,  int stock,  int minStock,  bool active,  bool hasSales)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ProductView() when $default != null:
return $default(_that.id,_that.name,_that.price,_that.categoryId,_that.categoryName,_that.sku,_that.photoPath,_that.stock,_that.minStock,_that.active,_that.hasSales);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  int price,  String categoryId,  String categoryName,  String? sku,  String? photoPath,  int stock,  int minStock,  bool active,  bool hasSales)  $default,) {final _that = this;
switch (_that) {
case _ProductView():
return $default(_that.id,_that.name,_that.price,_that.categoryId,_that.categoryName,_that.sku,_that.photoPath,_that.stock,_that.minStock,_that.active,_that.hasSales);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  int price,  String categoryId,  String categoryName,  String? sku,  String? photoPath,  int stock,  int minStock,  bool active,  bool hasSales)?  $default,) {final _that = this;
switch (_that) {
case _ProductView() when $default != null:
return $default(_that.id,_that.name,_that.price,_that.categoryId,_that.categoryName,_that.sku,_that.photoPath,_that.stock,_that.minStock,_that.active,_that.hasSales);case _:
  return null;

}
}

}

/// @nodoc


class _ProductView extends ProductView {
  const _ProductView({required this.id, required this.name, required this.price, required this.categoryId, this.categoryName = '', this.sku, this.photoPath, this.stock = 0, this.minStock = 0, this.active = true, this.hasSales = false}): super._();
  

@override final  String id;
@override final  String name;
@override final  int price;
@override final  String categoryId;
@override@JsonKey() final  String categoryName;
@override final  String? sku;
@override final  String? photoPath;
@override@JsonKey() final  int stock;
@override@JsonKey() final  int minStock;
@override@JsonKey() final  bool active;
/// Produk yang sudah pernah terjual hanya bisa dinonaktifkan, tidak dihapus.
@override@JsonKey() final  bool hasSales;

/// Create a copy of ProductView
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ProductViewCopyWith<_ProductView> get copyWith => __$ProductViewCopyWithImpl<_ProductView>(this, _$identity);



@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ProductView&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.price, price) || other.price == price)&&(identical(other.categoryId, categoryId) || other.categoryId == categoryId)&&(identical(other.categoryName, categoryName) || other.categoryName == categoryName)&&(identical(other.sku, sku) || other.sku == sku)&&(identical(other.photoPath, photoPath) || other.photoPath == photoPath)&&(identical(other.stock, stock) || other.stock == stock)&&(identical(other.minStock, minStock) || other.minStock == minStock)&&(identical(other.active, active) || other.active == active)&&(identical(other.hasSales, hasSales) || other.hasSales == hasSales));
}


@override
int get hashCode {
    return Object.hash(runtimeType,id,name,price,categoryId,categoryName,sku,photoPath,stock,minStock,active,hasSales);
}

@override
String toString() {
    return 'ProductView(id: $id, name: $name, price: $price, categoryId: $categoryId, categoryName: $categoryName, sku: $sku, photoPath: $photoPath, stock: $stock, minStock: $minStock, active: $active, hasSales: $hasSales)';
}


}

/// @nodoc
abstract mixin class _$ProductViewCopyWith<$Res> implements $ProductViewCopyWith<$Res> {
  factory _$ProductViewCopyWith(_ProductView value, $Res Function(_ProductView) _then) = __$ProductViewCopyWithImpl;
@override @useResult
$Res call({
 String id, String name, int price, String categoryId, String categoryName, String? sku, String? photoPath, int stock, int minStock, bool active, bool hasSales
});




}
/// @nodoc
class __$ProductViewCopyWithImpl<$Res>
    implements _$ProductViewCopyWith<$Res> {
  __$ProductViewCopyWithImpl(this._self, this._then);

  final _ProductView _self;
  final $Res Function(_ProductView) _then;

/// Create a copy of ProductView
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? price = null,Object? categoryId = null,Object? categoryName = null,Object? sku = freezed,Object? photoPath = freezed,Object? stock = null,Object? minStock = null,Object? active = null,Object? hasSales = null,}) {
  return _then(_ProductView(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as int,categoryId: null == categoryId ? _self.categoryId : categoryId // ignore: cast_nullable_to_non_nullable
as String,categoryName: null == categoryName ? _self.categoryName : categoryName // ignore: cast_nullable_to_non_nullable
as String,sku: freezed == sku ? _self.sku : sku // ignore: cast_nullable_to_non_nullable
as String?,photoPath: freezed == photoPath ? _self.photoPath : photoPath // ignore: cast_nullable_to_non_nullable
as String?,stock: null == stock ? _self.stock : stock // ignore: cast_nullable_to_non_nullable
as int,minStock: null == minStock ? _self.minStock : minStock // ignore: cast_nullable_to_non_nullable
as int,active: null == active ? _self.active : active // ignore: cast_nullable_to_non_nullable
as bool,hasSales: null == hasSales ? _self.hasSales : hasSales // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}

/// @nodoc
mixin _$CartItem {

 String get productId; String get name; int get price; int get qty; int get stock;/// Ditandai saat checkout ditolak karena stok tidak cukup.
 bool get outOfStock;
/// Create a copy of CartItem
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CartItemCopyWith<CartItem> get copyWith => _$CartItemCopyWithImpl<CartItem>(this as CartItem, _$identity);



@override
bool operator ==(Object other) {
  final _this = this as CartItem;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CartItem&&(identical(other.productId, _this.productId) || other.productId == _this.productId)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.price, _this.price) || other.price == _this.price)&&(identical(other.qty, _this.qty) || other.qty == _this.qty)&&(identical(other.stock, _this.stock) || other.stock == _this.stock)&&(identical(other.outOfStock, _this.outOfStock) || other.outOfStock == _this.outOfStock));
}


@override
int get hashCode {
  final _this = this as CartItem;
  return Object.hash(runtimeType,_this.productId,_this.name,_this.price,_this.qty,_this.stock,_this.outOfStock);
}

@override
String toString() {
  final _this = this as CartItem;
  return 'CartItem(productId: ${_this.productId}, name: ${_this.name}, price: ${_this.price}, qty: ${_this.qty}, stock: ${_this.stock}, outOfStock: ${_this.outOfStock})';
}


}

/// @nodoc
abstract mixin class $CartItemCopyWith<$Res>  {
  factory $CartItemCopyWith(CartItem value, $Res Function(CartItem) _then) = _$CartItemCopyWithImpl;
@useResult
$Res call({
 String productId, String name, int price, int qty, int stock, bool outOfStock
});




}
/// @nodoc
class _$CartItemCopyWithImpl<$Res>
    implements $CartItemCopyWith<$Res> {
  _$CartItemCopyWithImpl(this._self, this._then);

  final CartItem _self;
  final $Res Function(CartItem) _then;

/// Create a copy of CartItem
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? productId = null,Object? name = null,Object? price = null,Object? qty = null,Object? stock = null,Object? outOfStock = null,}) {
  return _then(CartItem(
productId: null == productId ? _self.productId : productId // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as int,qty: null == qty ? _self.qty : qty // ignore: cast_nullable_to_non_nullable
as int,stock: null == stock ? _self.stock : stock // ignore: cast_nullable_to_non_nullable
as int,outOfStock: null == outOfStock ? _self.outOfStock : outOfStock // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [CartItem].
extension CartItemPatterns on CartItem {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CartItem value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CartItem() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CartItem value)  $default,){
final _that = this;
switch (_that) {
case _CartItem():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CartItem value)?  $default,){
final _that = this;
switch (_that) {
case _CartItem() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String productId,  String name,  int price,  int qty,  int stock,  bool outOfStock)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CartItem() when $default != null:
return $default(_that.productId,_that.name,_that.price,_that.qty,_that.stock,_that.outOfStock);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String productId,  String name,  int price,  int qty,  int stock,  bool outOfStock)  $default,) {final _that = this;
switch (_that) {
case _CartItem():
return $default(_that.productId,_that.name,_that.price,_that.qty,_that.stock,_that.outOfStock);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String productId,  String name,  int price,  int qty,  int stock,  bool outOfStock)?  $default,) {final _that = this;
switch (_that) {
case _CartItem() when $default != null:
return $default(_that.productId,_that.name,_that.price,_that.qty,_that.stock,_that.outOfStock);case _:
  return null;

}
}

}

/// @nodoc


class _CartItem extends CartItem {
  const _CartItem({required this.productId, required this.name, required this.price, required this.qty, required this.stock, this.outOfStock = false}): super._();
  

@override final  String productId;
@override final  String name;
@override final  int price;
@override final  int qty;
@override final  int stock;
/// Ditandai saat checkout ditolak karena stok tidak cukup.
@override@JsonKey() final  bool outOfStock;

/// Create a copy of CartItem
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CartItemCopyWith<_CartItem> get copyWith => __$CartItemCopyWithImpl<_CartItem>(this, _$identity);



@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _CartItem&&(identical(other.productId, productId) || other.productId == productId)&&(identical(other.name, name) || other.name == name)&&(identical(other.price, price) || other.price == price)&&(identical(other.qty, qty) || other.qty == qty)&&(identical(other.stock, stock) || other.stock == stock)&&(identical(other.outOfStock, outOfStock) || other.outOfStock == outOfStock));
}


@override
int get hashCode {
    return Object.hash(runtimeType,productId,name,price,qty,stock,outOfStock);
}

@override
String toString() {
    return 'CartItem(productId: $productId, name: $name, price: $price, qty: $qty, stock: $stock, outOfStock: $outOfStock)';
}


}

/// @nodoc
abstract mixin class _$CartItemCopyWith<$Res> implements $CartItemCopyWith<$Res> {
  factory _$CartItemCopyWith(_CartItem value, $Res Function(_CartItem) _then) = __$CartItemCopyWithImpl;
@override @useResult
$Res call({
 String productId, String name, int price, int qty, int stock, bool outOfStock
});




}
/// @nodoc
class __$CartItemCopyWithImpl<$Res>
    implements _$CartItemCopyWith<$Res> {
  __$CartItemCopyWithImpl(this._self, this._then);

  final _CartItem _self;
  final $Res Function(_CartItem) _then;

/// Create a copy of CartItem
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? productId = null,Object? name = null,Object? price = null,Object? qty = null,Object? stock = null,Object? outOfStock = null,}) {
  return _then(_CartItem(
productId: null == productId ? _self.productId : productId // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as int,qty: null == qty ? _self.qty : qty // ignore: cast_nullable_to_non_nullable
as int,stock: null == stock ? _self.stock : stock // ignore: cast_nullable_to_non_nullable
as int,outOfStock: null == outOfStock ? _self.outOfStock : outOfStock // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}

/// @nodoc
mixin _$Cart {

 List<CartItem> get items; TaxSettings get tax; String get orderType;
/// Create a copy of Cart
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CartCopyWith<Cart> get copyWith => _$CartCopyWithImpl<Cart>(this as Cart, _$identity);



@override
bool operator ==(Object other) {
  final _this = this as Cart;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Cart&&const DeepCollectionEquality().equals(other.items, _this.items)&&(identical(other.tax, _this.tax) || other.tax == _this.tax)&&(identical(other.orderType, _this.orderType) || other.orderType == _this.orderType));
}


@override
int get hashCode {
  final _this = this as Cart;
  return Object.hash(runtimeType,const DeepCollectionEquality().hash(_this.items),_this.tax,_this.orderType);
}

@override
String toString() {
  final _this = this as Cart;
  return 'Cart(items: ${_this.items}, tax: ${_this.tax}, orderType: ${_this.orderType})';
}


}

/// @nodoc
abstract mixin class $CartCopyWith<$Res>  {
  factory $CartCopyWith(Cart value, $Res Function(Cart) _then) = _$CartCopyWithImpl;
@useResult
$Res call({
 List<CartItem> items, TaxSettings tax, String orderType
});


$TaxSettingsCopyWith<$Res> get tax;

}
/// @nodoc
class _$CartCopyWithImpl<$Res>
    implements $CartCopyWith<$Res> {
  _$CartCopyWithImpl(this._self, this._then);

  final Cart _self;
  final $Res Function(Cart) _then;

/// Create a copy of Cart
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? items = null,Object? tax = null,Object? orderType = null,}) {
  return _then(Cart(
items: null == items ? _self.items : items // ignore: cast_nullable_to_non_nullable
as List<CartItem>,tax: null == tax ? _self.tax : tax // ignore: cast_nullable_to_non_nullable
as TaxSettings,orderType: null == orderType ? _self.orderType : orderType // ignore: cast_nullable_to_non_nullable
as String,
  ));
}
/// Create a copy of Cart
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$TaxSettingsCopyWith<$Res> get tax {
  
  return $TaxSettingsCopyWith<$Res>(_self.tax, (value) {
    return _then(_self.copyWith(tax: value));
  });
}
}


/// Adds pattern-matching-related methods to [Cart].
extension CartPatterns on Cart {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Cart value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _Cart() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Cart value)  $default,){
final _that = this;
switch (_that) {
case _Cart():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Cart value)?  $default,){
final _that = this;
switch (_that) {
case _Cart() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( List<CartItem> items,  TaxSettings tax,  String orderType)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _Cart() when $default != null:
return $default(_that.items,_that.tax,_that.orderType);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( List<CartItem> items,  TaxSettings tax,  String orderType)  $default,) {final _that = this;
switch (_that) {
case _Cart():
return $default(_that.items,_that.tax,_that.orderType);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( List<CartItem> items,  TaxSettings tax,  String orderType)?  $default,) {final _that = this;
switch (_that) {
case _Cart() when $default != null:
return $default(_that.items,_that.tax,_that.orderType);case _:
  return null;

}
}

}

/// @nodoc


class _Cart extends Cart {
  const _Cart({ List<CartItem> items = const <CartItem>[], this.tax = const TaxSettings(), this.orderType = 'Dine in'}): _items = items,super._();
  

 final  List<CartItem> _items;
@override@JsonKey() List<CartItem> get items {
  if (_items is EqualUnmodifiableListView) return _items;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_items);
}

@override@JsonKey() final  TaxSettings tax;
@override@JsonKey() final  String orderType;

/// Create a copy of Cart
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CartCopyWith<_Cart> get copyWith => __$CartCopyWithImpl<_Cart>(this, _$identity);



@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _Cart&&const DeepCollectionEquality().equals(other.items, _items)&&(identical(other.tax, tax) || other.tax == tax)&&(identical(other.orderType, orderType) || other.orderType == orderType));
}


@override
int get hashCode {
    return Object.hash(runtimeType,const DeepCollectionEquality().hash(_items),tax,orderType);
}

@override
String toString() {
    return 'Cart(items: $items, tax: $tax, orderType: $orderType)';
}


}

/// @nodoc
abstract mixin class _$CartCopyWith<$Res> implements $CartCopyWith<$Res> {
  factory _$CartCopyWith(_Cart value, $Res Function(_Cart) _then) = __$CartCopyWithImpl;
@override @useResult
$Res call({
 List<CartItem> items, TaxSettings tax, String orderType
});


@override $TaxSettingsCopyWith<$Res> get tax;

}
/// @nodoc
class __$CartCopyWithImpl<$Res>
    implements _$CartCopyWith<$Res> {
  __$CartCopyWithImpl(this._self, this._then);

  final _Cart _self;
  final $Res Function(_Cart) _then;

/// Create a copy of Cart
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? items = null,Object? tax = null,Object? orderType = null,}) {
  return _then(_Cart(
items: null == items ? _self._items : items // ignore: cast_nullable_to_non_nullable
as List<CartItem>,tax: null == tax ? _self.tax : tax // ignore: cast_nullable_to_non_nullable
as TaxSettings,orderType: null == orderType ? _self.orderType : orderType // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

/// Create a copy of Cart
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$TaxSettingsCopyWith<$Res> get tax {
  
  return $TaxSettingsCopyWith<$Res>(_self.tax, (value) {
    return _then(_self.copyWith(tax: value));
  });
}
}

/// @nodoc
mixin _$TransactionItemView {

 String get productId; String get name; int get price; int get qty;
/// Create a copy of TransactionItemView
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$TransactionItemViewCopyWith<TransactionItemView> get copyWith => _$TransactionItemViewCopyWithImpl<TransactionItemView>(this as TransactionItemView, _$identity);



@override
bool operator ==(Object other) {
  final _this = this as TransactionItemView;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is TransactionItemView&&(identical(other.productId, _this.productId) || other.productId == _this.productId)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.price, _this.price) || other.price == _this.price)&&(identical(other.qty, _this.qty) || other.qty == _this.qty));
}


@override
int get hashCode {
  final _this = this as TransactionItemView;
  return Object.hash(runtimeType,_this.productId,_this.name,_this.price,_this.qty);
}

@override
String toString() {
  final _this = this as TransactionItemView;
  return 'TransactionItemView(productId: ${_this.productId}, name: ${_this.name}, price: ${_this.price}, qty: ${_this.qty})';
}


}

/// @nodoc
abstract mixin class $TransactionItemViewCopyWith<$Res>  {
  factory $TransactionItemViewCopyWith(TransactionItemView value, $Res Function(TransactionItemView) _then) = _$TransactionItemViewCopyWithImpl;
@useResult
$Res call({
 String productId, String name, int price, int qty
});




}
/// @nodoc
class _$TransactionItemViewCopyWithImpl<$Res>
    implements $TransactionItemViewCopyWith<$Res> {
  _$TransactionItemViewCopyWithImpl(this._self, this._then);

  final TransactionItemView _self;
  final $Res Function(TransactionItemView) _then;

/// Create a copy of TransactionItemView
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? productId = null,Object? name = null,Object? price = null,Object? qty = null,}) {
  return _then(TransactionItemView(
productId: null == productId ? _self.productId : productId // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as int,qty: null == qty ? _self.qty : qty // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [TransactionItemView].
extension TransactionItemViewPatterns on TransactionItemView {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _TransactionItemView value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _TransactionItemView() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _TransactionItemView value)  $default,){
final _that = this;
switch (_that) {
case _TransactionItemView():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _TransactionItemView value)?  $default,){
final _that = this;
switch (_that) {
case _TransactionItemView() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String productId,  String name,  int price,  int qty)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _TransactionItemView() when $default != null:
return $default(_that.productId,_that.name,_that.price,_that.qty);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String productId,  String name,  int price,  int qty)  $default,) {final _that = this;
switch (_that) {
case _TransactionItemView():
return $default(_that.productId,_that.name,_that.price,_that.qty);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String productId,  String name,  int price,  int qty)?  $default,) {final _that = this;
switch (_that) {
case _TransactionItemView() when $default != null:
return $default(_that.productId,_that.name,_that.price,_that.qty);case _:
  return null;

}
}

}

/// @nodoc


class _TransactionItemView extends TransactionItemView {
  const _TransactionItemView({required this.productId, required this.name, required this.price, required this.qty}): super._();
  

@override final  String productId;
@override final  String name;
@override final  int price;
@override final  int qty;

/// Create a copy of TransactionItemView
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$TransactionItemViewCopyWith<_TransactionItemView> get copyWith => __$TransactionItemViewCopyWithImpl<_TransactionItemView>(this, _$identity);



@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _TransactionItemView&&(identical(other.productId, productId) || other.productId == productId)&&(identical(other.name, name) || other.name == name)&&(identical(other.price, price) || other.price == price)&&(identical(other.qty, qty) || other.qty == qty));
}


@override
int get hashCode {
    return Object.hash(runtimeType,productId,name,price,qty);
}

@override
String toString() {
    return 'TransactionItemView(productId: $productId, name: $name, price: $price, qty: $qty)';
}


}

/// @nodoc
abstract mixin class _$TransactionItemViewCopyWith<$Res> implements $TransactionItemViewCopyWith<$Res> {
  factory _$TransactionItemViewCopyWith(_TransactionItemView value, $Res Function(_TransactionItemView) _then) = __$TransactionItemViewCopyWithImpl;
@override @useResult
$Res call({
 String productId, String name, int price, int qty
});




}
/// @nodoc
class __$TransactionItemViewCopyWithImpl<$Res>
    implements _$TransactionItemViewCopyWith<$Res> {
  __$TransactionItemViewCopyWithImpl(this._self, this._then);

  final _TransactionItemView _self;
  final $Res Function(_TransactionItemView) _then;

/// Create a copy of TransactionItemView
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? productId = null,Object? name = null,Object? price = null,Object? qty = null,}) {
  return _then(_TransactionItemView(
productId: null == productId ? _self.productId : productId // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,price: null == price ? _self.price : price // ignore: cast_nullable_to_non_nullable
as int,qty: null == qty ? _self.qty : qty // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

/// @nodoc
mixin _$TransactionView {

 String get id; String get receiptNo; DateTime get createdAt; PaymentMethod get method; String get orderType; List<TransactionItemView> get items; int get subtotal; String get taxName; int get taxRateBp; bool get taxInclusive; int get taxAmount; int get total; int get received; TransactionStatus get status; String? get voidReason;
/// Create a copy of TransactionView
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$TransactionViewCopyWith<TransactionView> get copyWith => _$TransactionViewCopyWithImpl<TransactionView>(this as TransactionView, _$identity);



@override
bool operator ==(Object other) {
  final _this = this as TransactionView;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is TransactionView&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.receiptNo, _this.receiptNo) || other.receiptNo == _this.receiptNo)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.method, _this.method) || other.method == _this.method)&&(identical(other.orderType, _this.orderType) || other.orderType == _this.orderType)&&const DeepCollectionEquality().equals(other.items, _this.items)&&(identical(other.subtotal, _this.subtotal) || other.subtotal == _this.subtotal)&&(identical(other.taxName, _this.taxName) || other.taxName == _this.taxName)&&(identical(other.taxRateBp, _this.taxRateBp) || other.taxRateBp == _this.taxRateBp)&&(identical(other.taxInclusive, _this.taxInclusive) || other.taxInclusive == _this.taxInclusive)&&(identical(other.taxAmount, _this.taxAmount) || other.taxAmount == _this.taxAmount)&&(identical(other.total, _this.total) || other.total == _this.total)&&(identical(other.received, _this.received) || other.received == _this.received)&&(identical(other.status, _this.status) || other.status == _this.status)&&(identical(other.voidReason, _this.voidReason) || other.voidReason == _this.voidReason));
}


@override
int get hashCode {
  final _this = this as TransactionView;
  return Object.hash(runtimeType,_this.id,_this.receiptNo,_this.createdAt,_this.method,_this.orderType,const DeepCollectionEquality().hash(_this.items),_this.subtotal,_this.taxName,_this.taxRateBp,_this.taxInclusive,_this.taxAmount,_this.total,_this.received,_this.status,_this.voidReason);
}

@override
String toString() {
  final _this = this as TransactionView;
  return 'TransactionView(id: ${_this.id}, receiptNo: ${_this.receiptNo}, createdAt: ${_this.createdAt}, method: ${_this.method}, orderType: ${_this.orderType}, items: ${_this.items}, subtotal: ${_this.subtotal}, taxName: ${_this.taxName}, taxRateBp: ${_this.taxRateBp}, taxInclusive: ${_this.taxInclusive}, taxAmount: ${_this.taxAmount}, total: ${_this.total}, received: ${_this.received}, status: ${_this.status}, voidReason: ${_this.voidReason})';
}


}

/// @nodoc
abstract mixin class $TransactionViewCopyWith<$Res>  {
  factory $TransactionViewCopyWith(TransactionView value, $Res Function(TransactionView) _then) = _$TransactionViewCopyWithImpl;
@useResult
$Res call({
 String id, String receiptNo, DateTime createdAt, PaymentMethod method, String orderType, List<TransactionItemView> items, int subtotal, String taxName, int taxRateBp, bool taxInclusive, int taxAmount, int total, int received, TransactionStatus status, String? voidReason
});




}
/// @nodoc
class _$TransactionViewCopyWithImpl<$Res>
    implements $TransactionViewCopyWith<$Res> {
  _$TransactionViewCopyWithImpl(this._self, this._then);

  final TransactionView _self;
  final $Res Function(TransactionView) _then;

/// Create a copy of TransactionView
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? receiptNo = null,Object? createdAt = null,Object? method = null,Object? orderType = null,Object? items = null,Object? subtotal = null,Object? taxName = null,Object? taxRateBp = null,Object? taxInclusive = null,Object? taxAmount = null,Object? total = null,Object? received = null,Object? status = null,Object? voidReason = freezed,}) {
  return _then(TransactionView(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,receiptNo: null == receiptNo ? _self.receiptNo : receiptNo // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,method: null == method ? _self.method : method // ignore: cast_nullable_to_non_nullable
as PaymentMethod,orderType: null == orderType ? _self.orderType : orderType // ignore: cast_nullable_to_non_nullable
as String,items: null == items ? _self.items : items // ignore: cast_nullable_to_non_nullable
as List<TransactionItemView>,subtotal: null == subtotal ? _self.subtotal : subtotal // ignore: cast_nullable_to_non_nullable
as int,taxName: null == taxName ? _self.taxName : taxName // ignore: cast_nullable_to_non_nullable
as String,taxRateBp: null == taxRateBp ? _self.taxRateBp : taxRateBp // ignore: cast_nullable_to_non_nullable
as int,taxInclusive: null == taxInclusive ? _self.taxInclusive : taxInclusive // ignore: cast_nullable_to_non_nullable
as bool,taxAmount: null == taxAmount ? _self.taxAmount : taxAmount // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,received: null == received ? _self.received : received // ignore: cast_nullable_to_non_nullable
as int,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as TransactionStatus,voidReason: freezed == voidReason ? _self.voidReason : voidReason // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [TransactionView].
extension TransactionViewPatterns on TransactionView {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _TransactionView value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _TransactionView() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _TransactionView value)  $default,){
final _that = this;
switch (_that) {
case _TransactionView():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _TransactionView value)?  $default,){
final _that = this;
switch (_that) {
case _TransactionView() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String receiptNo,  DateTime createdAt,  PaymentMethod method,  String orderType,  List<TransactionItemView> items,  int subtotal,  String taxName,  int taxRateBp,  bool taxInclusive,  int taxAmount,  int total,  int received,  TransactionStatus status,  String? voidReason)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _TransactionView() when $default != null:
return $default(_that.id,_that.receiptNo,_that.createdAt,_that.method,_that.orderType,_that.items,_that.subtotal,_that.taxName,_that.taxRateBp,_that.taxInclusive,_that.taxAmount,_that.total,_that.received,_that.status,_that.voidReason);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String receiptNo,  DateTime createdAt,  PaymentMethod method,  String orderType,  List<TransactionItemView> items,  int subtotal,  String taxName,  int taxRateBp,  bool taxInclusive,  int taxAmount,  int total,  int received,  TransactionStatus status,  String? voidReason)  $default,) {final _that = this;
switch (_that) {
case _TransactionView():
return $default(_that.id,_that.receiptNo,_that.createdAt,_that.method,_that.orderType,_that.items,_that.subtotal,_that.taxName,_that.taxRateBp,_that.taxInclusive,_that.taxAmount,_that.total,_that.received,_that.status,_that.voidReason);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String receiptNo,  DateTime createdAt,  PaymentMethod method,  String orderType,  List<TransactionItemView> items,  int subtotal,  String taxName,  int taxRateBp,  bool taxInclusive,  int taxAmount,  int total,  int received,  TransactionStatus status,  String? voidReason)?  $default,) {final _that = this;
switch (_that) {
case _TransactionView() when $default != null:
return $default(_that.id,_that.receiptNo,_that.createdAt,_that.method,_that.orderType,_that.items,_that.subtotal,_that.taxName,_that.taxRateBp,_that.taxInclusive,_that.taxAmount,_that.total,_that.received,_that.status,_that.voidReason);case _:
  return null;

}
}

}

/// @nodoc


class _TransactionView extends TransactionView {
  const _TransactionView({required this.id, required this.receiptNo, required this.createdAt, required this.method, required this.orderType, required  List<TransactionItemView> items, required this.subtotal, required this.taxName, required this.taxRateBp, required this.taxInclusive, required this.taxAmount, required this.total, required this.received, this.status = TransactionStatus.completed, this.voidReason}): _items = items,super._();
  

@override final  String id;
@override final  String receiptNo;
@override final  DateTime createdAt;
@override final  PaymentMethod method;
@override final  String orderType;
 final  List<TransactionItemView> _items;
@override List<TransactionItemView> get items {
  if (_items is EqualUnmodifiableListView) return _items;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_items);
}

@override final  int subtotal;
@override final  String taxName;
@override final  int taxRateBp;
@override final  bool taxInclusive;
@override final  int taxAmount;
@override final  int total;
@override final  int received;
@override@JsonKey() final  TransactionStatus status;
@override final  String? voidReason;

/// Create a copy of TransactionView
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$TransactionViewCopyWith<_TransactionView> get copyWith => __$TransactionViewCopyWithImpl<_TransactionView>(this, _$identity);



@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _TransactionView&&(identical(other.id, id) || other.id == id)&&(identical(other.receiptNo, receiptNo) || other.receiptNo == receiptNo)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.method, method) || other.method == method)&&(identical(other.orderType, orderType) || other.orderType == orderType)&&const DeepCollectionEquality().equals(other.items, _items)&&(identical(other.subtotal, subtotal) || other.subtotal == subtotal)&&(identical(other.taxName, taxName) || other.taxName == taxName)&&(identical(other.taxRateBp, taxRateBp) || other.taxRateBp == taxRateBp)&&(identical(other.taxInclusive, taxInclusive) || other.taxInclusive == taxInclusive)&&(identical(other.taxAmount, taxAmount) || other.taxAmount == taxAmount)&&(identical(other.total, total) || other.total == total)&&(identical(other.received, received) || other.received == received)&&(identical(other.status, status) || other.status == status)&&(identical(other.voidReason, voidReason) || other.voidReason == voidReason));
}


@override
int get hashCode {
    return Object.hash(runtimeType,id,receiptNo,createdAt,method,orderType,const DeepCollectionEquality().hash(_items),subtotal,taxName,taxRateBp,taxInclusive,taxAmount,total,received,status,voidReason);
}

@override
String toString() {
    return 'TransactionView(id: $id, receiptNo: $receiptNo, createdAt: $createdAt, method: $method, orderType: $orderType, items: $items, subtotal: $subtotal, taxName: $taxName, taxRateBp: $taxRateBp, taxInclusive: $taxInclusive, taxAmount: $taxAmount, total: $total, received: $received, status: $status, voidReason: $voidReason)';
}


}

/// @nodoc
abstract mixin class _$TransactionViewCopyWith<$Res> implements $TransactionViewCopyWith<$Res> {
  factory _$TransactionViewCopyWith(_TransactionView value, $Res Function(_TransactionView) _then) = __$TransactionViewCopyWithImpl;
@override @useResult
$Res call({
 String id, String receiptNo, DateTime createdAt, PaymentMethod method, String orderType, List<TransactionItemView> items, int subtotal, String taxName, int taxRateBp, bool taxInclusive, int taxAmount, int total, int received, TransactionStatus status, String? voidReason
});




}
/// @nodoc
class __$TransactionViewCopyWithImpl<$Res>
    implements _$TransactionViewCopyWith<$Res> {
  __$TransactionViewCopyWithImpl(this._self, this._then);

  final _TransactionView _self;
  final $Res Function(_TransactionView) _then;

/// Create a copy of TransactionView
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? receiptNo = null,Object? createdAt = null,Object? method = null,Object? orderType = null,Object? items = null,Object? subtotal = null,Object? taxName = null,Object? taxRateBp = null,Object? taxInclusive = null,Object? taxAmount = null,Object? total = null,Object? received = null,Object? status = null,Object? voidReason = freezed,}) {
  return _then(_TransactionView(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,receiptNo: null == receiptNo ? _self.receiptNo : receiptNo // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,method: null == method ? _self.method : method // ignore: cast_nullable_to_non_nullable
as PaymentMethod,orderType: null == orderType ? _self.orderType : orderType // ignore: cast_nullable_to_non_nullable
as String,items: null == items ? _self._items : items // ignore: cast_nullable_to_non_nullable
as List<TransactionItemView>,subtotal: null == subtotal ? _self.subtotal : subtotal // ignore: cast_nullable_to_non_nullable
as int,taxName: null == taxName ? _self.taxName : taxName // ignore: cast_nullable_to_non_nullable
as String,taxRateBp: null == taxRateBp ? _self.taxRateBp : taxRateBp // ignore: cast_nullable_to_non_nullable
as int,taxInclusive: null == taxInclusive ? _self.taxInclusive : taxInclusive // ignore: cast_nullable_to_non_nullable
as bool,taxAmount: null == taxAmount ? _self.taxAmount : taxAmount // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,received: null == received ? _self.received : received // ignore: cast_nullable_to_non_nullable
as int,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as TransactionStatus,voidReason: freezed == voidReason ? _self.voidReason : voidReason // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

/// @nodoc
mixin _$StockMovementView {

 String get id; String get productId; StockMovementType get type; int get qtyChange; int get stockAfter; DateTime get createdAt; String? get note;
/// Create a copy of StockMovementView
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$StockMovementViewCopyWith<StockMovementView> get copyWith => _$StockMovementViewCopyWithImpl<StockMovementView>(this as StockMovementView, _$identity);



@override
bool operator ==(Object other) {
  final _this = this as StockMovementView;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is StockMovementView&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.productId, _this.productId) || other.productId == _this.productId)&&(identical(other.type, _this.type) || other.type == _this.type)&&(identical(other.qtyChange, _this.qtyChange) || other.qtyChange == _this.qtyChange)&&(identical(other.stockAfter, _this.stockAfter) || other.stockAfter == _this.stockAfter)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt)&&(identical(other.note, _this.note) || other.note == _this.note));
}


@override
int get hashCode {
  final _this = this as StockMovementView;
  return Object.hash(runtimeType,_this.id,_this.productId,_this.type,_this.qtyChange,_this.stockAfter,_this.createdAt,_this.note);
}

@override
String toString() {
  final _this = this as StockMovementView;
  return 'StockMovementView(id: ${_this.id}, productId: ${_this.productId}, type: ${_this.type}, qtyChange: ${_this.qtyChange}, stockAfter: ${_this.stockAfter}, createdAt: ${_this.createdAt}, note: ${_this.note})';
}


}

/// @nodoc
abstract mixin class $StockMovementViewCopyWith<$Res>  {
  factory $StockMovementViewCopyWith(StockMovementView value, $Res Function(StockMovementView) _then) = _$StockMovementViewCopyWithImpl;
@useResult
$Res call({
 String id, String productId, StockMovementType type, int qtyChange, int stockAfter, DateTime createdAt, String? note
});




}
/// @nodoc
class _$StockMovementViewCopyWithImpl<$Res>
    implements $StockMovementViewCopyWith<$Res> {
  _$StockMovementViewCopyWithImpl(this._self, this._then);

  final StockMovementView _self;
  final $Res Function(StockMovementView) _then;

/// Create a copy of StockMovementView
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? productId = null,Object? type = null,Object? qtyChange = null,Object? stockAfter = null,Object? createdAt = null,Object? note = freezed,}) {
  return _then(StockMovementView(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,productId: null == productId ? _self.productId : productId // ignore: cast_nullable_to_non_nullable
as String,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as StockMovementType,qtyChange: null == qtyChange ? _self.qtyChange : qtyChange // ignore: cast_nullable_to_non_nullable
as int,stockAfter: null == stockAfter ? _self.stockAfter : stockAfter // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,note: freezed == note ? _self.note : note // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [StockMovementView].
extension StockMovementViewPatterns on StockMovementView {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _StockMovementView value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _StockMovementView() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _StockMovementView value)  $default,){
final _that = this;
switch (_that) {
case _StockMovementView():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _StockMovementView value)?  $default,){
final _that = this;
switch (_that) {
case _StockMovementView() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String productId,  StockMovementType type,  int qtyChange,  int stockAfter,  DateTime createdAt,  String? note)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _StockMovementView() when $default != null:
return $default(_that.id,_that.productId,_that.type,_that.qtyChange,_that.stockAfter,_that.createdAt,_that.note);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String productId,  StockMovementType type,  int qtyChange,  int stockAfter,  DateTime createdAt,  String? note)  $default,) {final _that = this;
switch (_that) {
case _StockMovementView():
return $default(_that.id,_that.productId,_that.type,_that.qtyChange,_that.stockAfter,_that.createdAt,_that.note);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String productId,  StockMovementType type,  int qtyChange,  int stockAfter,  DateTime createdAt,  String? note)?  $default,) {final _that = this;
switch (_that) {
case _StockMovementView() when $default != null:
return $default(_that.id,_that.productId,_that.type,_that.qtyChange,_that.stockAfter,_that.createdAt,_that.note);case _:
  return null;

}
}

}

/// @nodoc


class _StockMovementView implements StockMovementView {
  const _StockMovementView({required this.id, required this.productId, required this.type, required this.qtyChange, required this.stockAfter, required this.createdAt, this.note});
  

@override final  String id;
@override final  String productId;
@override final  StockMovementType type;
@override final  int qtyChange;
@override final  int stockAfter;
@override final  DateTime createdAt;
@override final  String? note;

/// Create a copy of StockMovementView
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$StockMovementViewCopyWith<_StockMovementView> get copyWith => __$StockMovementViewCopyWithImpl<_StockMovementView>(this, _$identity);



@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _StockMovementView&&(identical(other.id, id) || other.id == id)&&(identical(other.productId, productId) || other.productId == productId)&&(identical(other.type, type) || other.type == type)&&(identical(other.qtyChange, qtyChange) || other.qtyChange == qtyChange)&&(identical(other.stockAfter, stockAfter) || other.stockAfter == stockAfter)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.note, note) || other.note == note));
}


@override
int get hashCode {
    return Object.hash(runtimeType,id,productId,type,qtyChange,stockAfter,createdAt,note);
}

@override
String toString() {
    return 'StockMovementView(id: $id, productId: $productId, type: $type, qtyChange: $qtyChange, stockAfter: $stockAfter, createdAt: $createdAt, note: $note)';
}


}

/// @nodoc
abstract mixin class _$StockMovementViewCopyWith<$Res> implements $StockMovementViewCopyWith<$Res> {
  factory _$StockMovementViewCopyWith(_StockMovementView value, $Res Function(_StockMovementView) _then) = __$StockMovementViewCopyWithImpl;
@override @useResult
$Res call({
 String id, String productId, StockMovementType type, int qtyChange, int stockAfter, DateTime createdAt, String? note
});




}
/// @nodoc
class __$StockMovementViewCopyWithImpl<$Res>
    implements _$StockMovementViewCopyWith<$Res> {
  __$StockMovementViewCopyWithImpl(this._self, this._then);

  final _StockMovementView _self;
  final $Res Function(_StockMovementView) _then;

/// Create a copy of StockMovementView
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? productId = null,Object? type = null,Object? qtyChange = null,Object? stockAfter = null,Object? createdAt = null,Object? note = freezed,}) {
  return _then(_StockMovementView(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,productId: null == productId ? _self.productId : productId // ignore: cast_nullable_to_non_nullable
as String,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as StockMovementType,qtyChange: null == qtyChange ? _self.qtyChange : qtyChange // ignore: cast_nullable_to_non_nullable
as int,stockAfter: null == stockAfter ? _self.stockAfter : stockAfter // ignore: cast_nullable_to_non_nullable
as int,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime,note: freezed == note ? _self.note : note // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

/// @nodoc
mixin _$StoreSettings {

 bool get setupDone; String get storeName; String get address; String get phone; String get receiptHeader; String get receiptFooter; String? get logoPath; String get receiptPrefix;/// true: nomor struk mulai dari 1 setiap hari (INV-261121-0001).
 bool get dailyReset; TaxSettings get tax; PaperWidth get paper; String? get printerAddress; String? get printerName; String get userName; String? get userPhotoPath;
/// Create a copy of StoreSettings
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$StoreSettingsCopyWith<StoreSettings> get copyWith => _$StoreSettingsCopyWithImpl<StoreSettings>(this as StoreSettings, _$identity);



@override
bool operator ==(Object other) {
  final _this = this as StoreSettings;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is StoreSettings&&(identical(other.setupDone, _this.setupDone) || other.setupDone == _this.setupDone)&&(identical(other.storeName, _this.storeName) || other.storeName == _this.storeName)&&(identical(other.address, _this.address) || other.address == _this.address)&&(identical(other.phone, _this.phone) || other.phone == _this.phone)&&(identical(other.receiptHeader, _this.receiptHeader) || other.receiptHeader == _this.receiptHeader)&&(identical(other.receiptFooter, _this.receiptFooter) || other.receiptFooter == _this.receiptFooter)&&(identical(other.logoPath, _this.logoPath) || other.logoPath == _this.logoPath)&&(identical(other.receiptPrefix, _this.receiptPrefix) || other.receiptPrefix == _this.receiptPrefix)&&(identical(other.dailyReset, _this.dailyReset) || other.dailyReset == _this.dailyReset)&&(identical(other.tax, _this.tax) || other.tax == _this.tax)&&(identical(other.paper, _this.paper) || other.paper == _this.paper)&&(identical(other.printerAddress, _this.printerAddress) || other.printerAddress == _this.printerAddress)&&(identical(other.printerName, _this.printerName) || other.printerName == _this.printerName)&&(identical(other.userName, _this.userName) || other.userName == _this.userName)&&(identical(other.userPhotoPath, _this.userPhotoPath) || other.userPhotoPath == _this.userPhotoPath));
}


@override
int get hashCode {
  final _this = this as StoreSettings;
  return Object.hash(runtimeType,_this.setupDone,_this.storeName,_this.address,_this.phone,_this.receiptHeader,_this.receiptFooter,_this.logoPath,_this.receiptPrefix,_this.dailyReset,_this.tax,_this.paper,_this.printerAddress,_this.printerName,_this.userName,_this.userPhotoPath);
}

@override
String toString() {
  final _this = this as StoreSettings;
  return 'StoreSettings(setupDone: ${_this.setupDone}, storeName: ${_this.storeName}, address: ${_this.address}, phone: ${_this.phone}, receiptHeader: ${_this.receiptHeader}, receiptFooter: ${_this.receiptFooter}, logoPath: ${_this.logoPath}, receiptPrefix: ${_this.receiptPrefix}, dailyReset: ${_this.dailyReset}, tax: ${_this.tax}, paper: ${_this.paper}, printerAddress: ${_this.printerAddress}, printerName: ${_this.printerName}, userName: ${_this.userName}, userPhotoPath: ${_this.userPhotoPath})';
}


}

/// @nodoc
abstract mixin class $StoreSettingsCopyWith<$Res>  {
  factory $StoreSettingsCopyWith(StoreSettings value, $Res Function(StoreSettings) _then) = _$StoreSettingsCopyWithImpl;
@useResult
$Res call({
 bool setupDone, String storeName, String address, String phone, String receiptHeader, String receiptFooter, String? logoPath, String receiptPrefix, bool dailyReset, TaxSettings tax, PaperWidth paper, String? printerAddress, String? printerName, String userName, String? userPhotoPath
});


$TaxSettingsCopyWith<$Res> get tax;

}
/// @nodoc
class _$StoreSettingsCopyWithImpl<$Res>
    implements $StoreSettingsCopyWith<$Res> {
  _$StoreSettingsCopyWithImpl(this._self, this._then);

  final StoreSettings _self;
  final $Res Function(StoreSettings) _then;

/// Create a copy of StoreSettings
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? setupDone = null,Object? storeName = null,Object? address = null,Object? phone = null,Object? receiptHeader = null,Object? receiptFooter = null,Object? logoPath = freezed,Object? receiptPrefix = null,Object? dailyReset = null,Object? tax = null,Object? paper = null,Object? printerAddress = freezed,Object? printerName = freezed,Object? userName = null,Object? userPhotoPath = freezed,}) {
  return _then(StoreSettings(
setupDone: null == setupDone ? _self.setupDone : setupDone // ignore: cast_nullable_to_non_nullable
as bool,storeName: null == storeName ? _self.storeName : storeName // ignore: cast_nullable_to_non_nullable
as String,address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,phone: null == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String,receiptHeader: null == receiptHeader ? _self.receiptHeader : receiptHeader // ignore: cast_nullable_to_non_nullable
as String,receiptFooter: null == receiptFooter ? _self.receiptFooter : receiptFooter // ignore: cast_nullable_to_non_nullable
as String,logoPath: freezed == logoPath ? _self.logoPath : logoPath // ignore: cast_nullable_to_non_nullable
as String?,receiptPrefix: null == receiptPrefix ? _self.receiptPrefix : receiptPrefix // ignore: cast_nullable_to_non_nullable
as String,dailyReset: null == dailyReset ? _self.dailyReset : dailyReset // ignore: cast_nullable_to_non_nullable
as bool,tax: null == tax ? _self.tax : tax // ignore: cast_nullable_to_non_nullable
as TaxSettings,paper: null == paper ? _self.paper : paper // ignore: cast_nullable_to_non_nullable
as PaperWidth,printerAddress: freezed == printerAddress ? _self.printerAddress : printerAddress // ignore: cast_nullable_to_non_nullable
as String?,printerName: freezed == printerName ? _self.printerName : printerName // ignore: cast_nullable_to_non_nullable
as String?,userName: null == userName ? _self.userName : userName // ignore: cast_nullable_to_non_nullable
as String,userPhotoPath: freezed == userPhotoPath ? _self.userPhotoPath : userPhotoPath // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}
/// Create a copy of StoreSettings
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$TaxSettingsCopyWith<$Res> get tax {
  
  return $TaxSettingsCopyWith<$Res>(_self.tax, (value) {
    return _then(_self.copyWith(tax: value));
  });
}
}


/// Adds pattern-matching-related methods to [StoreSettings].
extension StoreSettingsPatterns on StoreSettings {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _StoreSettings value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _StoreSettings() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _StoreSettings value)  $default,){
final _that = this;
switch (_that) {
case _StoreSettings():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _StoreSettings value)?  $default,){
final _that = this;
switch (_that) {
case _StoreSettings() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool setupDone,  String storeName,  String address,  String phone,  String receiptHeader,  String receiptFooter,  String? logoPath,  String receiptPrefix,  bool dailyReset,  TaxSettings tax,  PaperWidth paper,  String? printerAddress,  String? printerName,  String userName,  String? userPhotoPath)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _StoreSettings() when $default != null:
return $default(_that.setupDone,_that.storeName,_that.address,_that.phone,_that.receiptHeader,_that.receiptFooter,_that.logoPath,_that.receiptPrefix,_that.dailyReset,_that.tax,_that.paper,_that.printerAddress,_that.printerName,_that.userName,_that.userPhotoPath);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool setupDone,  String storeName,  String address,  String phone,  String receiptHeader,  String receiptFooter,  String? logoPath,  String receiptPrefix,  bool dailyReset,  TaxSettings tax,  PaperWidth paper,  String? printerAddress,  String? printerName,  String userName,  String? userPhotoPath)  $default,) {final _that = this;
switch (_that) {
case _StoreSettings():
return $default(_that.setupDone,_that.storeName,_that.address,_that.phone,_that.receiptHeader,_that.receiptFooter,_that.logoPath,_that.receiptPrefix,_that.dailyReset,_that.tax,_that.paper,_that.printerAddress,_that.printerName,_that.userName,_that.userPhotoPath);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool setupDone,  String storeName,  String address,  String phone,  String receiptHeader,  String receiptFooter,  String? logoPath,  String receiptPrefix,  bool dailyReset,  TaxSettings tax,  PaperWidth paper,  String? printerAddress,  String? printerName,  String userName,  String? userPhotoPath)?  $default,) {final _that = this;
switch (_that) {
case _StoreSettings() when $default != null:
return $default(_that.setupDone,_that.storeName,_that.address,_that.phone,_that.receiptHeader,_that.receiptFooter,_that.logoPath,_that.receiptPrefix,_that.dailyReset,_that.tax,_that.paper,_that.printerAddress,_that.printerName,_that.userName,_that.userPhotoPath);case _:
  return null;

}
}

}

/// @nodoc


class _StoreSettings implements StoreSettings {
  const _StoreSettings({this.setupDone = false, this.storeName = '', this.address = '', this.phone = '', this.receiptHeader = '', this.receiptFooter = 'Terima kasih atas kunjungan Anda', this.logoPath, this.receiptPrefix = 'INV', this.dailyReset = true, this.tax = const TaxSettings(), this.paper = PaperWidth.mm58, this.printerAddress, this.printerName, this.userName = 'Pengguna', this.userPhotoPath});
  

@override@JsonKey() final  bool setupDone;
@override@JsonKey() final  String storeName;
@override@JsonKey() final  String address;
@override@JsonKey() final  String phone;
@override@JsonKey() final  String receiptHeader;
@override@JsonKey() final  String receiptFooter;
@override final  String? logoPath;
@override@JsonKey() final  String receiptPrefix;
/// true: nomor struk mulai dari 1 setiap hari (INV-261121-0001).
@override@JsonKey() final  bool dailyReset;
@override@JsonKey() final  TaxSettings tax;
@override@JsonKey() final  PaperWidth paper;
@override final  String? printerAddress;
@override final  String? printerName;
@override@JsonKey() final  String userName;
@override final  String? userPhotoPath;

/// Create a copy of StoreSettings
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$StoreSettingsCopyWith<_StoreSettings> get copyWith => __$StoreSettingsCopyWithImpl<_StoreSettings>(this, _$identity);



@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _StoreSettings&&(identical(other.setupDone, setupDone) || other.setupDone == setupDone)&&(identical(other.storeName, storeName) || other.storeName == storeName)&&(identical(other.address, address) || other.address == address)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.receiptHeader, receiptHeader) || other.receiptHeader == receiptHeader)&&(identical(other.receiptFooter, receiptFooter) || other.receiptFooter == receiptFooter)&&(identical(other.logoPath, logoPath) || other.logoPath == logoPath)&&(identical(other.receiptPrefix, receiptPrefix) || other.receiptPrefix == receiptPrefix)&&(identical(other.dailyReset, dailyReset) || other.dailyReset == dailyReset)&&(identical(other.tax, tax) || other.tax == tax)&&(identical(other.paper, paper) || other.paper == paper)&&(identical(other.printerAddress, printerAddress) || other.printerAddress == printerAddress)&&(identical(other.printerName, printerName) || other.printerName == printerName)&&(identical(other.userName, userName) || other.userName == userName)&&(identical(other.userPhotoPath, userPhotoPath) || other.userPhotoPath == userPhotoPath));
}


@override
int get hashCode {
    return Object.hash(runtimeType,setupDone,storeName,address,phone,receiptHeader,receiptFooter,logoPath,receiptPrefix,dailyReset,tax,paper,printerAddress,printerName,userName,userPhotoPath);
}

@override
String toString() {
    return 'StoreSettings(setupDone: $setupDone, storeName: $storeName, address: $address, phone: $phone, receiptHeader: $receiptHeader, receiptFooter: $receiptFooter, logoPath: $logoPath, receiptPrefix: $receiptPrefix, dailyReset: $dailyReset, tax: $tax, paper: $paper, printerAddress: $printerAddress, printerName: $printerName, userName: $userName, userPhotoPath: $userPhotoPath)';
}


}

/// @nodoc
abstract mixin class _$StoreSettingsCopyWith<$Res> implements $StoreSettingsCopyWith<$Res> {
  factory _$StoreSettingsCopyWith(_StoreSettings value, $Res Function(_StoreSettings) _then) = __$StoreSettingsCopyWithImpl;
@override @useResult
$Res call({
 bool setupDone, String storeName, String address, String phone, String receiptHeader, String receiptFooter, String? logoPath, String receiptPrefix, bool dailyReset, TaxSettings tax, PaperWidth paper, String? printerAddress, String? printerName, String userName, String? userPhotoPath
});


@override $TaxSettingsCopyWith<$Res> get tax;

}
/// @nodoc
class __$StoreSettingsCopyWithImpl<$Res>
    implements _$StoreSettingsCopyWith<$Res> {
  __$StoreSettingsCopyWithImpl(this._self, this._then);

  final _StoreSettings _self;
  final $Res Function(_StoreSettings) _then;

/// Create a copy of StoreSettings
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? setupDone = null,Object? storeName = null,Object? address = null,Object? phone = null,Object? receiptHeader = null,Object? receiptFooter = null,Object? logoPath = freezed,Object? receiptPrefix = null,Object? dailyReset = null,Object? tax = null,Object? paper = null,Object? printerAddress = freezed,Object? printerName = freezed,Object? userName = null,Object? userPhotoPath = freezed,}) {
  return _then(_StoreSettings(
setupDone: null == setupDone ? _self.setupDone : setupDone // ignore: cast_nullable_to_non_nullable
as bool,storeName: null == storeName ? _self.storeName : storeName // ignore: cast_nullable_to_non_nullable
as String,address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,phone: null == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String,receiptHeader: null == receiptHeader ? _self.receiptHeader : receiptHeader // ignore: cast_nullable_to_non_nullable
as String,receiptFooter: null == receiptFooter ? _self.receiptFooter : receiptFooter // ignore: cast_nullable_to_non_nullable
as String,logoPath: freezed == logoPath ? _self.logoPath : logoPath // ignore: cast_nullable_to_non_nullable
as String?,receiptPrefix: null == receiptPrefix ? _self.receiptPrefix : receiptPrefix // ignore: cast_nullable_to_non_nullable
as String,dailyReset: null == dailyReset ? _self.dailyReset : dailyReset // ignore: cast_nullable_to_non_nullable
as bool,tax: null == tax ? _self.tax : tax // ignore: cast_nullable_to_non_nullable
as TaxSettings,paper: null == paper ? _self.paper : paper // ignore: cast_nullable_to_non_nullable
as PaperWidth,printerAddress: freezed == printerAddress ? _self.printerAddress : printerAddress // ignore: cast_nullable_to_non_nullable
as String?,printerName: freezed == printerName ? _self.printerName : printerName // ignore: cast_nullable_to_non_nullable
as String?,userName: null == userName ? _self.userName : userName // ignore: cast_nullable_to_non_nullable
as String,userPhotoPath: freezed == userPhotoPath ? _self.userPhotoPath : userPhotoPath // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

/// Create a copy of StoreSettings
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$TaxSettingsCopyWith<$Res> get tax {
  
  return $TaxSettingsCopyWith<$Res>(_self.tax, (value) {
    return _then(_self.copyWith(tax: value));
  });
}
}

/// @nodoc
mixin _$ReceiptLine {

 String get text; bool get bold;
/// Create a copy of ReceiptLine
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ReceiptLineCopyWith<ReceiptLine> get copyWith => _$ReceiptLineCopyWithImpl<ReceiptLine>(this as ReceiptLine, _$identity);



@override
bool operator ==(Object other) {
  final _this = this as ReceiptLine;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ReceiptLine&&(identical(other.text, _this.text) || other.text == _this.text)&&(identical(other.bold, _this.bold) || other.bold == _this.bold));
}


@override
int get hashCode {
  final _this = this as ReceiptLine;
  return Object.hash(runtimeType,_this.text,_this.bold);
}

@override
String toString() {
  final _this = this as ReceiptLine;
  return 'ReceiptLine(text: ${_this.text}, bold: ${_this.bold})';
}


}

/// @nodoc
abstract mixin class $ReceiptLineCopyWith<$Res>  {
  factory $ReceiptLineCopyWith(ReceiptLine value, $Res Function(ReceiptLine) _then) = _$ReceiptLineCopyWithImpl;
@useResult
$Res call({
 String text, bool bold
});




}
/// @nodoc
class _$ReceiptLineCopyWithImpl<$Res>
    implements $ReceiptLineCopyWith<$Res> {
  _$ReceiptLineCopyWithImpl(this._self, this._then);

  final ReceiptLine _self;
  final $Res Function(ReceiptLine) _then;

/// Create a copy of ReceiptLine
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? text = null,Object? bold = null,}) {
  return _then(ReceiptLine(
null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
as String,bold: null == bold ? _self.bold : bold // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [ReceiptLine].
extension ReceiptLinePatterns on ReceiptLine {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ReceiptLine value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ReceiptLine() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ReceiptLine value)  $default,){
final _that = this;
switch (_that) {
case _ReceiptLine():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ReceiptLine value)?  $default,){
final _that = this;
switch (_that) {
case _ReceiptLine() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String text,  bool bold)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ReceiptLine() when $default != null:
return $default(_that.text,_that.bold);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String text,  bool bold)  $default,) {final _that = this;
switch (_that) {
case _ReceiptLine():
return $default(_that.text,_that.bold);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String text,  bool bold)?  $default,) {final _that = this;
switch (_that) {
case _ReceiptLine() when $default != null:
return $default(_that.text,_that.bold);case _:
  return null;

}
}

}

/// @nodoc


class _ReceiptLine implements ReceiptLine {
  const _ReceiptLine(this.text, {this.bold = false});
  

@override final  String text;
@override@JsonKey() final  bool bold;

/// Create a copy of ReceiptLine
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ReceiptLineCopyWith<_ReceiptLine> get copyWith => __$ReceiptLineCopyWithImpl<_ReceiptLine>(this, _$identity);



@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ReceiptLine&&(identical(other.text, text) || other.text == text)&&(identical(other.bold, bold) || other.bold == bold));
}


@override
int get hashCode {
    return Object.hash(runtimeType,text,bold);
}

@override
String toString() {
    return 'ReceiptLine(text: $text, bold: $bold)';
}


}

/// @nodoc
abstract mixin class _$ReceiptLineCopyWith<$Res> implements $ReceiptLineCopyWith<$Res> {
  factory _$ReceiptLineCopyWith(_ReceiptLine value, $Res Function(_ReceiptLine) _then) = __$ReceiptLineCopyWithImpl;
@override @useResult
$Res call({
 String text, bool bold
});




}
/// @nodoc
class __$ReceiptLineCopyWithImpl<$Res>
    implements _$ReceiptLineCopyWith<$Res> {
  __$ReceiptLineCopyWithImpl(this._self, this._then);

  final _ReceiptLine _self;
  final $Res Function(_ReceiptLine) _then;

/// Create a copy of ReceiptLine
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? text = null,Object? bold = null,}) {
  return _then(_ReceiptLine(
null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
as String,bold: null == bold ? _self.bold : bold // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}

// dart format on
