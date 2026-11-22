/// Checkout dibatalkan (rollback) karena stok produk ini tidak cukup.
class OutOfStockException implements Exception {
  const OutOfStockException(this.productId);
  final String productId;

  @override
  String toString() => 'OutOfStockException($productId)';
}

/// Nama produk atau kategori sudah dipakai.
class DuplicateNameException implements Exception {
  const DuplicateNameException(this.name);
  final String name;

  @override
  String toString() => 'DuplicateNameException($name)';
}
