// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'tax.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$TaxSettings {

 bool get enabled; String get name; int get rateBp;/// true = harga produk sudah termasuk pajak; false = pajak ditambahkan.
 bool get inclusive;
/// Create a copy of TaxSettings
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$TaxSettingsCopyWith<TaxSettings> get copyWith => _$TaxSettingsCopyWithImpl<TaxSettings>(this as TaxSettings, _$identity);



@override
bool operator ==(Object other) {
  final _this = this as TaxSettings;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is TaxSettings&&(identical(other.enabled, _this.enabled) || other.enabled == _this.enabled)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.rateBp, _this.rateBp) || other.rateBp == _this.rateBp)&&(identical(other.inclusive, _this.inclusive) || other.inclusive == _this.inclusive));
}


@override
int get hashCode {
  final _this = this as TaxSettings;
  return Object.hash(runtimeType,_this.enabled,_this.name,_this.rateBp,_this.inclusive);
}

@override
String toString() {
  final _this = this as TaxSettings;
  return 'TaxSettings(enabled: ${_this.enabled}, name: ${_this.name}, rateBp: ${_this.rateBp}, inclusive: ${_this.inclusive})';
}


}

/// @nodoc
abstract mixin class $TaxSettingsCopyWith<$Res>  {
  factory $TaxSettingsCopyWith(TaxSettings value, $Res Function(TaxSettings) _then) = _$TaxSettingsCopyWithImpl;
@useResult
$Res call({
 bool enabled, String name, int rateBp, bool inclusive
});




}
/// @nodoc
class _$TaxSettingsCopyWithImpl<$Res>
    implements $TaxSettingsCopyWith<$Res> {
  _$TaxSettingsCopyWithImpl(this._self, this._then);

  final TaxSettings _self;
  final $Res Function(TaxSettings) _then;

/// Create a copy of TaxSettings
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? enabled = null,Object? name = null,Object? rateBp = null,Object? inclusive = null,}) {
  return _then(TaxSettings(
enabled: null == enabled ? _self.enabled : enabled // ignore: cast_nullable_to_non_nullable
as bool,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,rateBp: null == rateBp ? _self.rateBp : rateBp // ignore: cast_nullable_to_non_nullable
as int,inclusive: null == inclusive ? _self.inclusive : inclusive // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [TaxSettings].
extension TaxSettingsPatterns on TaxSettings {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _TaxSettings value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _TaxSettings() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _TaxSettings value)  $default,){
final _that = this;
switch (_that) {
case _TaxSettings():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _TaxSettings value)?  $default,){
final _that = this;
switch (_that) {
case _TaxSettings() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool enabled,  String name,  int rateBp,  bool inclusive)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _TaxSettings() when $default != null:
return $default(_that.enabled,_that.name,_that.rateBp,_that.inclusive);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool enabled,  String name,  int rateBp,  bool inclusive)  $default,) {final _that = this;
switch (_that) {
case _TaxSettings():
return $default(_that.enabled,_that.name,_that.rateBp,_that.inclusive);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool enabled,  String name,  int rateBp,  bool inclusive)?  $default,) {final _that = this;
switch (_that) {
case _TaxSettings() when $default != null:
return $default(_that.enabled,_that.name,_that.rateBp,_that.inclusive);case _:
  return null;

}
}

}

/// @nodoc


class _TaxSettings implements TaxSettings {
  const _TaxSettings({this.enabled = false, this.name = 'PPN', this.rateBp = 1100, this.inclusive = false});
  

@override@JsonKey() final  bool enabled;
@override@JsonKey() final  String name;
@override@JsonKey() final  int rateBp;
/// true = harga produk sudah termasuk pajak; false = pajak ditambahkan.
@override@JsonKey() final  bool inclusive;

/// Create a copy of TaxSettings
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$TaxSettingsCopyWith<_TaxSettings> get copyWith => __$TaxSettingsCopyWithImpl<_TaxSettings>(this, _$identity);



@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _TaxSettings&&(identical(other.enabled, enabled) || other.enabled == enabled)&&(identical(other.name, name) || other.name == name)&&(identical(other.rateBp, rateBp) || other.rateBp == rateBp)&&(identical(other.inclusive, inclusive) || other.inclusive == inclusive));
}


@override
int get hashCode {
    return Object.hash(runtimeType,enabled,name,rateBp,inclusive);
}

@override
String toString() {
    return 'TaxSettings(enabled: $enabled, name: $name, rateBp: $rateBp, inclusive: $inclusive)';
}


}

/// @nodoc
abstract mixin class _$TaxSettingsCopyWith<$Res> implements $TaxSettingsCopyWith<$Res> {
  factory _$TaxSettingsCopyWith(_TaxSettings value, $Res Function(_TaxSettings) _then) = __$TaxSettingsCopyWithImpl;
@override @useResult
$Res call({
 bool enabled, String name, int rateBp, bool inclusive
});




}
/// @nodoc
class __$TaxSettingsCopyWithImpl<$Res>
    implements _$TaxSettingsCopyWith<$Res> {
  __$TaxSettingsCopyWithImpl(this._self, this._then);

  final _TaxSettings _self;
  final $Res Function(_TaxSettings) _then;

/// Create a copy of TaxSettings
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? enabled = null,Object? name = null,Object? rateBp = null,Object? inclusive = null,}) {
  return _then(_TaxSettings(
enabled: null == enabled ? _self.enabled : enabled // ignore: cast_nullable_to_non_nullable
as bool,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,rateBp: null == rateBp ? _self.rateBp : rateBp // ignore: cast_nullable_to_non_nullable
as int,inclusive: null == inclusive ? _self.inclusive : inclusive // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}

/// @nodoc
mixin _$TaxResult {

 int get subtotal; int get tax; int get total;
/// Create a copy of TaxResult
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$TaxResultCopyWith<TaxResult> get copyWith => _$TaxResultCopyWithImpl<TaxResult>(this as TaxResult, _$identity);



@override
bool operator ==(Object other) {
  final _this = this as TaxResult;
  return identical(this, other) || (other.runtimeType == runtimeType&&other is TaxResult&&(identical(other.subtotal, _this.subtotal) || other.subtotal == _this.subtotal)&&(identical(other.tax, _this.tax) || other.tax == _this.tax)&&(identical(other.total, _this.total) || other.total == _this.total));
}


@override
int get hashCode {
  final _this = this as TaxResult;
  return Object.hash(runtimeType,_this.subtotal,_this.tax,_this.total);
}

@override
String toString() {
  final _this = this as TaxResult;
  return 'TaxResult(subtotal: ${_this.subtotal}, tax: ${_this.tax}, total: ${_this.total})';
}


}

/// @nodoc
abstract mixin class $TaxResultCopyWith<$Res>  {
  factory $TaxResultCopyWith(TaxResult value, $Res Function(TaxResult) _then) = _$TaxResultCopyWithImpl;
@useResult
$Res call({
 int subtotal, int tax, int total
});




}
/// @nodoc
class _$TaxResultCopyWithImpl<$Res>
    implements $TaxResultCopyWith<$Res> {
  _$TaxResultCopyWithImpl(this._self, this._then);

  final TaxResult _self;
  final $Res Function(TaxResult) _then;

/// Create a copy of TaxResult
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? subtotal = null,Object? tax = null,Object? total = null,}) {
  return _then(TaxResult(
subtotal: null == subtotal ? _self.subtotal : subtotal // ignore: cast_nullable_to_non_nullable
as int,tax: null == tax ? _self.tax : tax // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [TaxResult].
extension TaxResultPatterns on TaxResult {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _TaxResult value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _TaxResult() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _TaxResult value)  $default,){
final _that = this;
switch (_that) {
case _TaxResult():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _TaxResult value)?  $default,){
final _that = this;
switch (_that) {
case _TaxResult() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( int subtotal,  int tax,  int total)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _TaxResult() when $default != null:
return $default(_that.subtotal,_that.tax,_that.total);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( int subtotal,  int tax,  int total)  $default,) {final _that = this;
switch (_that) {
case _TaxResult():
return $default(_that.subtotal,_that.tax,_that.total);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( int subtotal,  int tax,  int total)?  $default,) {final _that = this;
switch (_that) {
case _TaxResult() when $default != null:
return $default(_that.subtotal,_that.tax,_that.total);case _:
  return null;

}
}

}

/// @nodoc


class _TaxResult implements TaxResult {
  const _TaxResult({required this.subtotal, required this.tax, required this.total});
  

@override final  int subtotal;
@override final  int tax;
@override final  int total;

/// Create a copy of TaxResult
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$TaxResultCopyWith<_TaxResult> get copyWith => __$TaxResultCopyWithImpl<_TaxResult>(this, _$identity);



@override
bool operator ==(Object other) {
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _TaxResult&&(identical(other.subtotal, subtotal) || other.subtotal == subtotal)&&(identical(other.tax, tax) || other.tax == tax)&&(identical(other.total, total) || other.total == total));
}


@override
int get hashCode {
    return Object.hash(runtimeType,subtotal,tax,total);
}

@override
String toString() {
    return 'TaxResult(subtotal: $subtotal, tax: $tax, total: $total)';
}


}

/// @nodoc
abstract mixin class _$TaxResultCopyWith<$Res> implements $TaxResultCopyWith<$Res> {
  factory _$TaxResultCopyWith(_TaxResult value, $Res Function(_TaxResult) _then) = __$TaxResultCopyWithImpl;
@override @useResult
$Res call({
 int subtotal, int tax, int total
});




}
/// @nodoc
class __$TaxResultCopyWithImpl<$Res>
    implements _$TaxResultCopyWith<$Res> {
  __$TaxResultCopyWithImpl(this._self, this._then);

  final _TaxResult _self;
  final $Res Function(_TaxResult) _then;

/// Create a copy of TaxResult
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? subtotal = null,Object? tax = null,Object? total = null,}) {
  return _then(_TaxResult(
subtotal: null == subtotal ? _self.subtotal : subtotal // ignore: cast_nullable_to_non_nullable
as int,tax: null == tax ? _self.tax : tax // ignore: cast_nullable_to_non_nullable
as int,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
