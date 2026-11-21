# POS UMKM Indonesia

Monorepo. Spesifikasi produk ada di `PRD — POS UMKM Indonesia v1.md`.

| Folder      | Isi                                  | Stack              |
|-------------|--------------------------------------|--------------------|
| `backend/`  | REST API untuk web dan tablet        | Go (stdlib `net/http`) |
| `frontend/` | Web Owner, Admin Cabang, Superadmin  | Next.js + Tailwind |
| `mobile/`   | Aplikasi kasir tablet (landscape): `apps/kasir` + package `pos_core`, `pos_data`, `pos_printer`, `pos_ui` | Flutter (pub workspace) |

## Menjalankan

```bash
# Backend: http://localhost:8080/health
cd backend && go run .

# Frontend: http://localhost:3000
cd frontend && npm install && npm run dev

# Mobile (tablet via USB atau simulator)
cd mobile && flutter pub get && cd apps/kasir && flutter run
```

## Test

```bash
cd backend && go test ./...
cd frontend && npm run lint && npm run build
cd mobile && flutter analyze && for d in packages/* apps/kasir; do (cd $d && flutter test); done
```
