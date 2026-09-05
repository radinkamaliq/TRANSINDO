# PRD — TRANSIT (Jabodetabek Mobility Planner)

**Product Requirements Document**

| Item | Keterangan |
|---|---|
| Nama Produk | TRANSIT — Jabodetabek Mobility Planner |
| Tagline | *Plan your route. Manage your time. Move smarter.* |
| Jenis Dokumen | Product Requirements Document (PRD) |
| Versi | 1.0 |
| Status | Final — Siap untuk tahap desain teknis & pengembangan |
| Dokumen Terkait | `style.md` (Design System & UI Guidelines), `ERD.md` (Entity Relationship Diagram) |
| Jenis Project | Tugas Sekolah (Capstone / Proyek Individu-Kelompok) |
| Kualitas Referensi | Disusun setara dengan PRD prototype startup tahap awal |

---

## 1. Product Overview

TRANSIT adalah platform *web responsive* yang membantu pekerja, mahasiswa, dan masyarakat umum di kawasan Jabodetabek (Jakarta, Bogor, Depok, Tangerang, Bekasi) merencanakan perjalanan menggunakan transportasi umum secara lebih sederhana.

Berbeda dengan aplikasi pencari rute pada umumnya yang berhenti pada "rute dari A ke B", TRANSIT dibangun di sekitar satu pertanyaan yang lebih relevan bagi penggunanya sehari-hari:

> **"Jam berapa saya harus berangkat agar bisa tiba tepat waktu?"**

TRANSIT menyatukan proses pencarian rute, penghitungan estimasi durasi, pemahaman transit antar moda, dan estimasi biaya ke dalam satu alur kerja yang runtut: **lokasi awal → tujuan → target waktu tiba → preferensi → rekomendasi rute → waktu berangkat → estimasi tiba.**

Produk ini dikembangkan sebagai proyek sekolah, namun disusun dengan struktur, kedalaman requirement, dan kualitas dokumentasi setara *early-stage startup product*, agar dapat dikembangkan secara bertahap tanpa perlu dirombak ulang.

---

## 2. Product Vision

Menjadi platform perencanaan perjalanan transportasi umum yang paling dapat diandalkan bagi masyarakat Jabodetabek dalam mengelola **waktu**, bukan hanya rute — sehingga keterlambatan akibat kurangnya informasi transportasi dapat diminimalkan.

Dalam jangka panjang (di luar cakupan tugas sekolah ini), visi ini dapat berkembang menjadi asisten mobilitas harian yang memahami rutinitas penggunanya dan secara proaktif membantu mereka mengatur waktu keberangkatan setiap hari.

---

## 3. Problem Statement

Informasi transportasi umum di Jabodetabek (KRL, MRT, LRT, TransJakarta, dan moda pendukung lainnya) tersebar di berbagai sumber yang berbeda-beda: aplikasi resmi masing-masing operator, media sosial, papan informasi stasiun, hingga informasi dari mulut ke mulut.

Akibatnya, pengguna harus melakukan semua proses berikut secara **manual**:

1. Mencari tahu moda dan rute apa saja yang menghubungkan lokasi asal dan tujuan mereka.
2. Menghitung sendiri estimasi total waktu perjalanan, termasuk waktu tunggu dan waktu transit.
3. Memahami di titik mana harus berpindah moda (transit) dan berapa lama jeda antar moda tersebut.
4. Memperkirakan sendiri jam berapa harus berangkat dari rumah/kantor agar tidak terlambat.

Proses manual ini memakan waktu, rawan salah perhitungan, dan sering kali baru disadari terlambat setelah pengguna sudah dalam perjalanan.

---

## 4. Goals

| # | Goal |
|---|---|
| G1 | Menyatukan proses pencarian rute transportasi umum Jabodetabek ke dalam satu platform. |
| G2 | Membantu pengguna mengetahui secara jelas **kapan harus berangkat** agar tiba sesuai target waktu, bukan sekadar menampilkan rute. |
| G3 | Menyajikan estimasi durasi, jumlah transit, dan estimasi biaya secara transparan sebelum perjalanan dimulai. |
| G4 | Mengurangi waktu dan usaha yang dibutuhkan pengguna untuk merencanakan perjalanan rutin maupun perjalanan baru. |
| G5 | Menyediakan struktur data dan sistem yang scalable, sehingga dapat berkembang secara bertahap melebihi cakupan tugas sekolah ini. |

---

## 5. Non-Goals

Agar cakupan proyek tetap realistis untuk dikerjakan oleh siswa, hal-hal berikut **secara sengaja tidak menjadi bagian dari TRANSIT**:

- **Bukan** aplikasi pemesanan atau pembayaran tiket transportasi.
- **Bukan** aplikasi navigasi turn-by-turn untuk kendaraan pribadi.
- **Bukan** aplikasi ride-hailing atau pemesanan ojek/taksi online.
- **Tidak** menjamin ketersediaan data posisi kendaraan secara *real-time* dari seluruh operator (lihat Aturan Penting #13).
- **Tidak** mencakup wilayah transportasi di luar Jabodetabek.
- **Tidak** dikembangkan sebagai aplikasi native (Android/iOS) — cakupan MVP adalah *responsive web* saja.
- **Tidak** menyediakan fitur reservasi tempat duduk atau kelas layanan.
- **Tidak** menambahkan fitur AI generatif yang tidak berkaitan langsung dengan masalah utama (misalnya chatbot AI umum), sesuai batasan proyek.
- **Tidak** dibangun dengan arsitektur microservices — cukup monolith yang scalable secara struktur kode.

---

## 6. Target Users

| Target User | Deskripsi Singkat |
|---|---|
| **Pekerja** | Karyawan yang melakukan perjalanan rutin (komuter) dari tempat tinggal ke kantor, umumnya sensitif terhadap ketepatan waktu kedatangan. |
| **Mahasiswa** | Pengguna dengan jadwal kuliah yang cenderung berubah tiap semester, membutuhkan perencanaan yang cepat disesuaikan. |
| **Masyarakat Umum** | Pengguna dengan kebutuhan perjalanan tidak rutin (mengurus keperluan pribadi, kunjungan, dll.), umumnya kurang familiar dengan seluruh pilihan transportasi yang tersedia. |

---

## 7. User Personas

### Persona 1 — Rina (Pekerja)

| Atribut | Detail |
|---|---|
| Usia | 27 tahun |
| Peran | Staf Marketing di kawasan Sudirman, Jakarta |
| Rute Rutin | Bekasi → Sudirman, setiap hari kerja |
| Tujuan | Tiba di kantor sebelum jam 08:00 tanpa harus berangkat terlalu pagi "untuk jaga-jaga". |
| Pain Point | Sering menebak-nebak jam berangkat sendiri; pernah terlambat karena tidak memperhitungkan waktu transit di Manggarai. |
| Kebutuhan Utama | Rekomendasi jam berangkat yang bisa diandalkan setiap hari, idealnya tersimpan sebagai rutinitas. |
| Perilaku | Membuka aplikasi setiap pagi sebelum berangkat; menghargai tampilan yang cepat dibaca. |

### Persona 2 — Dimas (Mahasiswa)

| Atribut | Detail |
|---|---|
| Usia | 20 tahun |
| Peran | Mahasiswa semester 5, kuliah di kawasan Depok |
| Rute Rutin | Bogor → Depok, jadwal kuliah berubah tiap semester |
| Tujuan | Menemukan rute paling murah, karena anggaran transportasi terbatas. |
| Pain Point | Harus mencari ulang rute setiap kali jadwal kuliah berubah; bingung memilih antara moda tercepat vs termurah. |
| Kebutuhan Utama | Preferensi pencarian yang jelas (termurah / tercepat) dan kemudahan mengganti rute tersimpan. |
| Perilaku | Merencanakan perjalanan dari HP, sering dalam kondisi jaringan yang tidak stabil. |

### Persona 3 — Ibu Sri (Masyarakat Umum)

| Atribut | Detail |
|---|---|
| Usia | 45 tahun |
| Peran | Ibu rumah tangga, sesekali bepergian untuk keperluan keluarga (rumah sakit, acara, mengunjungi keluarga) |
| Rute | Tidak rutin, tujuan berbeda-beda |
| Tujuan | Bisa tiba tepat waktu untuk janji temu tanpa harus memahami seluk-beluk sistem transportasi umum. |
| Pain Point | Kurang familiar dengan singkatan dan istilah transportasi (KRL, transit, dsb); mudah bingung jika tampilan terlalu teknis. |
| Kebutuhan Utama | Alur yang sederhana, istilah yang jelas, dan rekomendasi yang terasa seperti "diarahkan", bukan data mentah. |
| Perilaku | Menggunakan aplikasi hanya saat dibutuhkan, bukan pengguna harian. |

---

## 8. User Pain Points

| # | Pain Point |
|---|---|
| P1 | Informasi rute dan jadwal transportasi umum tersebar di berbagai sumber berbeda. |
| P2 | Sulit memperkirakan total waktu perjalanan secara akurat, terutama bila melibatkan transit. |
| P3 | Tidak ada cara mudah untuk mengetahui jam berapa harus mulai berangkat. |
| P4 | Proses berpindah moda (transit) sering membingungkan bagi pengguna yang belum familiar. |
| P5 | Estimasi biaya perjalanan tidak diketahui di awal, terutama untuk perjalanan gabungan beberapa moda. |
| P6 | Rute harian yang sama harus dicari ulang secara manual setiap kali dibutuhkan. |
| P7 | Tidak ada cara mudah melaporkan atau mengetahui bila terjadi gangguan/perubahan informasi layanan. |

---

## 9. Value Proposition

> **"Sampai tepat waktu, tanpa ribet."**
>
> TRANSIT membantu masyarakat Jabodetabek mengetahui kapan harus berangkat — bukan sekadar menampilkan rute dari titik A ke titik B — dengan menyatukan pencarian rute, estimasi waktu, transit, dan biaya dalam satu alur yang sederhana.

Nilai unik TRANSIT dibanding pencarian manual atau aplikasi operator tunggal:

- **Berorientasi waktu tiba**, bukan sekadar rute.
- **Lintas moda**, tidak terbatas pada satu operator/aplikasi.
- **Transparan**: durasi, transit, dan estimasi biaya terlihat sekaligus sebelum berangkat.
- **Personal**: mendukung rutinitas harian melalui Favorite Trip dan My Schedule.

---

## 10. Core User Journey

Alur inti TRANSIT mengikuti struktur berikut, sesuai *core value* produk:

```
1. Lokasi Awal      → Pengguna menentukan titik keberangkatan
2. Tujuan            → Pengguna menentukan titik tujuan
3. Target Waktu Tiba → Pengguna menentukan jam harus tiba
4. Preferensi        → Pengguna memilih preferensi (tercepat/termurah/dst.)
5. Rekomendasi Rute  → Sistem menampilkan alternatif rute terbaik
6. Waktu Berangkat   → Sistem menampilkan jam berangkat yang disarankan
7. Estimasi Tiba     → Pengguna melihat rincian perjalanan & mulai bergerak
```

Perjalanan pengguna secara menyeluruh (end-to-end):

1. Pengguna membuka TRANSIT (dengan atau tanpa login).
2. Pengguna mengisi Journey Planner: asal, tujuan, target waktu tiba, preferensi.
3. Sistem menjalankan **Smart Route Recommendation** untuk mencari kandidat rute.
4. Sistem menjalankan logika **Arrive On Time** untuk menghitung waktu berangkat yang disarankan dari tiap kandidat.
5. Pengguna membandingkan beberapa alternatif rute pada hasil pencarian.
6. Pengguna membuka **Route Detail** untuk melihat rincian tiap segmen perjalanan (timeline).
7. *(Opsional)* Pengguna menyimpan perjalanan sebagai **Favorite Trip**, atau mendaftarkannya sebagai **My Schedule** bila rutin.
8. Pengguna berangkat sesuai rekomendasi, dapat memantau posisi rute melalui **Interactive Map**.
9. *(Opsional)* Bila menemukan data yang tidak akurat, pengguna dapat mengirim **User Report**.

---

## 11. Feature List

Fitur dikelompokkan berdasarkan peran fungsionalnya dalam produk.

### A. Core Planning (inti nilai produk)

| Fitur | Deskripsi Singkat |
|---|---|
| **Journey Planner** | Form input utama: asal, tujuan, target waktu tiba, preferensi perjalanan. |
| **Smart Route Recommendation** | Mesin pencarian & pemeringkatan kandidat rute lintas moda berdasarkan preferensi pengguna. |
| **Arrive On Time** | Fitur inti (*wow feature*) yang menghitung mundur jam berangkat dari target waktu tiba, lengkap dengan buffer time. |
| **Route Detail** | Rincian satu rute terpilih dalam bentuk timeline per segmen perjalanan. |

### B. Discovery & Informasi

| Fitur | Deskripsi Singkat |
|---|---|
| **Interactive Map** | Peta pendukung keputusan: lokasi pengguna, asal, tujuan, stasiun/halte, dan rute terpilih. |
| **Transport Explorer** | Halaman eksplorasi moda, operator, dan rute yang tersedia di Jabodetabek. |

### C. Personalisasi

| Fitur | Deskripsi Singkat |
|---|---|
| **Favorite Trip** | Kemampuan menyimpan kombinasi asal-tujuan sebagai perjalanan favorit dari hasil pencarian. |
| **My Trips** | Halaman berisi daftar seluruh perjalanan tersimpan/favorit, siap dipakai ulang. |
| **My Schedule** | Rutinitas perjalanan berulang (misalnya jadwal kuliah/kerja) dengan target jam tiba tetap per hari tertentu. |

### D. Trust & Support

| Fitur | Deskripsi Singkat |
|---|---|
| **User Report** | Pelaporan data yang tidak akurat atau gangguan layanan oleh pengguna. |
| **Notifications** *(pendukung)* | Notifikasi dalam aplikasi terkait pengingat jadwal dan status laporan. Bukan bagian dari 12 fitur utama awal, namun merupakan kebutuhan turunan langsung dari My Schedule dan User Report, sehingga tetap didokumentasikan sebagai fitur pendukung berprioritas rendah. |

### E. Platform & Akses

| Fitur | Deskripsi Singkat |
|---|---|
| **Authentication** | Registrasi, login, dan pengelolaan sesi pengguna dengan peran (role). |
| **Admin Dashboard** | Panel pengelolaan data acuan (operator, moda, rute, stasiun/halte, jadwal, tarif) dan pengelolaan laporan pengguna. |

---

## 12. Feature Priority

| Fitur | Prioritas | Alasan |
|---|---|---|
| Authentication | **MUST HAVE** | Diperlukan sebagai fondasi untuk fitur personalisasi (Favorite Trip, My Schedule) dan peran Admin. |
| Journey Planner | **MUST HAVE** | Titik masuk utama seluruh core value produk. |
| Smart Route Recommendation | **MUST HAVE** | Mesin inti yang menghasilkan kandidat rute; tanpa ini tidak ada rekomendasi yang bisa ditampilkan. |
| Arrive On Time | **MUST HAVE** | Fitur pembeda utama (*wow feature*) dan inti dari value proposition produk. |
| Route Detail | **MUST HAVE** | Diperlukan agar rekomendasi rute dapat dipercaya dan dipahami penggunanya. |
| Interactive Map | **MUST HAVE** | Mendukung kepercayaan pengguna terhadap rute yang direkomendasikan; termasuk *fitur utama* yang diminta. |
| Transport Explorer | **MUST HAVE** | Menjawab langsung masalah utama: informasi transportasi yang tersebar. |
| Admin Dashboard | **MUST HAVE** | Tanpa pengelolaan data acuan (rute, jadwal, tarif), seluruh fitur pengguna tidak memiliki data untuk beroperasi. |
| Favorite Trip | **SHOULD HAVE** | Sangat bernilai bagi pengguna rutin, namun bukan syarat mutlak fungsi inti berjalan. |
| My Trips | **SHOULD HAVE** | Melengkapi Favorite Trip sebagai halaman pengelolaannya. |
| My Schedule | **SHOULD HAVE** | Perluasan alami dari Arrive On Time untuk kebutuhan rutinitas harian. |
| User Report | **SHOULD HAVE** | Penting untuk kualitas data jangka panjang, namun tidak menghalangi fungsi inti di MVP. |
| Notifications | **NICE TO HAVE** | Meningkatkan retensi & kegunaan My Schedule/User Report, tetapi bukan kebutuhan dasar. |

---

## 13. Detailed Functional Requirements

Notasi: **FR-[KODE FITUR]-[NOMOR]**.

### 13.1 Authentication (FR-AUTH)

| ID | Requirement |
|---|---|
| FR-AUTH-01 | Sistem harus memungkinkan pengguna baru mendaftar menggunakan nama, email, dan kata sandi. |
| FR-AUTH-02 | Sistem harus menolak pendaftaran dengan email yang sudah terdaftar dan menampilkan pesan kesalahan yang jelas. |
| FR-AUTH-03 | Sistem harus memungkinkan pengguna login menggunakan email dan kata sandi. |
| FR-AUTH-04 | Sistem harus menyimpan kata sandi dalam bentuk terenkripsi (hash), tidak pernah dalam bentuk teks biasa. |
| FR-AUTH-05 | Sistem harus membedakan sesi pengguna berdasarkan peran (role): Guest, Registered User, Admin. |
| FR-AUTH-06 | Sistem harus mengizinkan pengguna keluar (logout) dari sesi aktif. |
| FR-AUTH-07 | Sistem harus mencegah pengguna non-admin mengakses halaman/fungsi Admin Dashboard. |

### 13.2 Journey Planner (FR-JP)

| ID | Requirement |
|---|---|
| FR-JP-01 | Sistem harus menyediakan input Asal dan Tujuan, dapat diisi melalui pencarian nama stasiun/halte. |
| FR-JP-02 | Sistem harus menyediakan pilihan mode waktu: "Berangkat pukul" atau "Tiba sebelum pukul". |
| FR-JP-03 | Sistem harus menyediakan input target waktu (jam) sesuai mode yang dipilih. |
| FR-JP-04 | Sistem harus menyediakan pilihan preferensi perjalanan: Tercepat, Termurah, Minim Transit, Minim Jalan Kaki, Paling Nyaman. |
| FR-JP-05 | Sistem harus memvalidasi bahwa Asal dan Tujuan tidak boleh sama sebelum pencarian dijalankan. |
| FR-JP-06 | Sistem harus dapat dijalankan tanpa memerlukan login (Guest dapat menggunakan Journey Planner). |
| FR-JP-07 | Sistem harus menampilkan status *loading* saat proses pencarian rute berjalan. |

### 13.3 Smart Route Recommendation (FR-SRR)

| ID | Requirement |
|---|---|
| FR-SRR-01 | Sistem harus mencari kandidat rute langsung (tanpa transit) terlebih dahulu bila tersedia. |
| FR-SRR-02 | Sistem harus mencari kombinasi rute dengan satu atau lebih transit apabila rute langsung tidak tersedia atau bukan pilihan terbaik. |
| FR-SRR-03 | Sistem harus menghitung estimasi durasi total tiap kandidat rute, termasuk waktu tunggu dan waktu transit. |
| FR-SRR-04 | Sistem harus menghitung estimasi total biaya tiap kandidat rute. |
| FR-SRR-05 | Sistem harus menghitung jumlah transit tiap kandidat rute. |
| FR-SRR-06 | Sistem harus mengurutkan kandidat rute sesuai preferensi yang dipilih pengguna. |
| FR-SRR-07 | Sistem harus menampilkan minimal 3 alternatif rute apabila tersedia, dengan label seperti *Tercepat*, *Termurah*, atau *Minim Transit* pada rute yang relevan. |

### 13.4 Arrive On Time (FR-AOT)

| ID | Requirement |
|---|---|
| FR-AOT-01 | Sistem harus menghitung waktu keberangkatan yang disarankan berdasarkan target waktu tiba dikurangi estimasi durasi dan buffer time. |
| FR-AOT-02 | Sistem harus menampilkan buffer time secara eksplisit kepada pengguna, terpisah dari estimasi durasi perjalanan murni. |
| FR-AOT-03 | Sistem harus menambah buffer time secara proporsional terhadap jumlah transit pada rute tersebut. |
| FR-AOT-04 | Sistem harus menampilkan estimasi waktu tiba, total durasi, jumlah transit, dan estimasi biaya bersama rekomendasi waktu berangkat. |
| FR-AOT-05 | Sistem harus memberi peringatan apabila waktu berangkat yang direkomendasikan sudah lewat dari waktu saat ini. |
| FR-AOT-06 | Sistem harus tetap menampilkan rute tercepat yang tersedia apabila tidak ada rute yang dapat memenuhi target waktu tiba, disertai estimasi keterlambatan. |
| FR-AOT-07 | Sistem harus menampilkan indikator bila estimasi bersifat perkiraan karena data jadwal operator tidak lengkap/tidak real-time. |

### 13.5 Interactive Map (FR-MAP)

| ID | Requirement |
|---|---|
| FR-MAP-01 | Sistem harus menampilkan peta dengan penanda lokasi asal, tujuan, dan stasiun/halte terkait rute terpilih. |
| FR-MAP-02 | Sistem harus menampilkan rute terpilih sebagai jalur pada peta. |
| FR-MAP-03 | Sistem harus menyediakan kontrol zoom dan tombol "lokasi saya" pada peta. |
| FR-MAP-04 | Sistem harus meminta izin lokasi pengguna secara eksplisit dan tetap dapat berfungsi apabila izin ditolak (dengan input manual). |

### 13.6 Transport Explorer (FR-TE)

| ID | Requirement |
|---|---|
| FR-TE-01 | Sistem harus menampilkan daftar moda transportasi yang tersedia (KRL, MRT, LRT, TransJakarta, dan moda pendukung lain yang datanya tersedia). |
| FR-TE-02 | Sistem harus menyediakan filter berdasarkan Kota, Moda, dan Operator. |
| FR-TE-03 | Sistem harus menampilkan daftar rute per moda/operator yang dipilih. |
| FR-TE-04 | Sistem harus mengarahkan pengguna ke Route Detail saat memilih salah satu rute pada Transport Explorer. |

### 13.7 Route Detail (FR-RD)

| ID | Requirement |
|---|---|
| FR-RD-01 | Sistem harus menampilkan rincian rute dalam bentuk timeline vertikal per segmen (titik naik, moda, titik turun/transit). |
| FR-RD-02 | Sistem harus menandai titik transit secara visual berbeda dari titik pemberhentian biasa. |
| FR-RD-03 | Sistem harus menampilkan estimasi waktu pada tiap titik dalam timeline (naik, transit, tiba). |
| FR-RD-04 | Sistem harus memungkinkan pengguna menyimpan rute yang sedang dilihat sebagai Favorite Trip dari halaman ini. |

### 13.8 Favorite Trip (FR-FT)

| ID | Requirement |
|---|---|
| FR-FT-01 | Sistem harus memungkinkan pengguna terdaftar menyimpan kombinasi asal-tujuan sebagai perjalanan favorit dengan label bebas (contoh: "Rumah → Kantor"). |
| FR-FT-02 | Sistem harus mencegah penyimpanan Favorite Trip oleh pengguna yang belum login, dan mengarahkan ke halaman login. |
| FR-FT-03 | Sistem harus memungkinkan pengguna menghapus status favorit dari suatu perjalanan. |

### 13.9 My Trips (FR-MT)

| ID | Requirement |
|---|---|
| FR-MT-01 | Sistem harus menampilkan seluruh Favorite Trip milik pengguna yang sedang login. |
| FR-MT-02 | Sistem harus memungkinkan pengguna mengganti nama (label) perjalanan tersimpan. |
| FR-MT-03 | Sistem harus memungkinkan pengguna langsung menjalankan ulang pencarian dari salah satu perjalanan tersimpan ("Mulai Perjalanan"). |
| FR-MT-04 | Sistem harus menampilkan pesan kondisi kosong apabila belum ada perjalanan tersimpan. |

### 13.10 My Schedule (FR-MS)

| ID | Requirement |
|---|---|
| FR-MS-01 | Sistem harus memungkinkan pengguna terdaftar membuat jadwal rutin dengan nama, asal, tujuan, target jam tiba, dan hari berlaku. |
| FR-MS-02 | Sistem harus memungkinkan pemilihan lebih dari satu hari dalam seminggu untuk satu jadwal. |
| FR-MS-03 | Sistem harus menampilkan rekomendasi waktu berangkat terbaru untuk tiap jadwal aktif, menggunakan logika Arrive On Time. |
| FR-MS-04 | Sistem harus memungkinkan pengguna menonaktifkan sementara suatu jadwal tanpa menghapusnya. |

### 13.11 User Report (FR-UR)

| ID | Requirement |
|---|---|
| FR-UR-01 | Sistem harus memungkinkan pengguna terdaftar mengirim laporan terkait data rute/jadwal yang tidak akurat atau gangguan layanan. |
| FR-UR-02 | Sistem harus meminta jenis laporan dan deskripsi sebelum laporan dapat dikirim. |
| FR-UR-03 | Sistem harus memungkinkan laporan dikaitkan secara opsional dengan rute atau stasiun/halte tertentu. |
| FR-UR-04 | Sistem harus menampilkan status laporan (Menunggu, Ditinjau, Selesai, Ditolak) kepada pengguna yang mengirimkannya. |

### 13.12 Admin Dashboard (FR-ADM)

| ID | Requirement |
|---|---|
| FR-ADM-01 | Sistem harus menyediakan CRUD (create, read, update, delete) untuk data Operator. |
| FR-ADM-02 | Sistem harus menyediakan CRUD untuk data Moda Transportasi (Transport Type). |
| FR-ADM-03 | Sistem harus menyediakan CRUD untuk data Rute, termasuk pengaturan urutan pemberhentian (route-stop). |
| FR-ADM-04 | Sistem harus menyediakan CRUD untuk data Stasiun & Halte (Stations & Stops), termasuk penetapan kota. |
| FR-ADM-05 | Sistem harus menyediakan CRUD untuk data Jadwal (Schedule) per rute. |
| FR-ADM-06 | Sistem harus menyediakan CRUD untuk data Tarif (Fare) per rute atau per segmen rute. |
| FR-ADM-07 | Sistem harus menampilkan daftar laporan pengguna (User Report) dan memungkinkan Admin memperbarui statusnya. |
| FR-ADM-08 | Sistem harus menampilkan daftar akun pengguna dan memungkinkan Admin menonaktifkan akun bila diperlukan. |
| FR-ADM-09 | Sistem harus meminta konfirmasi sebelum melakukan aksi hapus data pada seluruh entitas di Admin Dashboard. |
| FR-ADM-10 | Sistem harus menampilkan pesan validasi yang jelas apabila data yang diinput Admin tidak lengkap atau tidak konsisten (contoh: rute tanpa pemberhentian). |

---

## 14. User Flow

### Flow A — Pengguna Baru (Guest) Mencari Rute

1. Pengguna membuka Home tanpa login.
2. Pengguna mengisi Journey Planner (asal, tujuan, target waktu tiba, preferensi).
3. Sistem menjalankan Smart Route Recommendation + Arrive On Time.
4. Sistem menampilkan daftar alternatif rute dengan rekomendasi waktu berangkat.
5. Pengguna memilih salah satu rute → membuka Route Detail.
6. Pengguna melihat timeline lengkap perjalanan.
7. *(Jika ingin menyimpan)* Sistem mengarahkan ke Login/Register terlebih dahulu.

### Flow B — Pengguna Terdaftar Menggunakan Favorite Trip

1. Pengguna login.
2. Pengguna membuka My Trips.
3. Pengguna memilih salah satu perjalanan tersimpan → "Mulai Perjalanan".
4. Sistem menjalankan ulang Smart Route Recommendation + Arrive On Time menggunakan data terbaru (jadwal saat ini).
5. Sistem menampilkan rekomendasi waktu berangkat terkini untuk perjalanan tersebut.

### Flow C — Pengguna Mengatur My Schedule

1. Pengguna login.
2. Pengguna membuka My Schedule → "Tambah Jadwal".
3. Pengguna mengisi nama jadwal, asal, tujuan, target jam tiba, dan hari berlaku.
4. Sistem menyimpan jadwal dan langsung menampilkan rekomendasi waktu berangkat awal.
5. Pada hari yang sesuai, sistem menampilkan/mengingatkan rekomendasi waktu berangkat terbaru (lihat Notifications, NICE TO HAVE).

### Flow D — Admin Mengelola Data Rute

1. Admin login ke Admin Dashboard.
2. Admin membuka menu Routes → "Tambah Rute Baru".
3. Admin memilih Operator dan Transport Type, lalu mengisi nama/kode rute.
4. Admin menambahkan daftar pemberhentian (stops) secara berurutan (route-stop).
5. Admin mengisi data Schedule (jam/headway) dan Fare untuk rute tersebut.
6. Sistem memvalidasi kelengkapan data sebelum rute berstatus aktif dan dapat digunakan oleh Smart Route Recommendation.

### Flow E — Pengguna Mengirim User Report

1. Pengguna (login) menemukan data yang dianggap tidak akurat pada Route Detail atau Transport Explorer.
2. Pengguna memilih "Laporkan" dan mengisi jenis laporan serta deskripsi.
3. Sistem menyimpan laporan dengan status "Menunggu".
4. Admin meninjau laporan pada Admin Dashboard dan memperbarui status.
5. Pengguna menerima notifikasi/perubahan status pada laporan miliknya.

---

## 15. Page / Sitemap

```
Public (Guest & Registered User)
├── Home                         (/)
├── Journey Planner & Hasil      (/plan)
├── Route Detail                 (/route/:id)
├── Interactive Map              (/map)
├── Transport Explorer           (/explore)
├── Transport Explorer Detail    (/explore/:operatorOrRouteId)
├── Login                        (/login)
└── Register                     (/register)

Registered User (memerlukan login)
├── My Trips                     (/trips)
├── My Schedule                  (/schedule)
├── Favorite Trip (aksi, bukan halaman terpisah — tersedia di hasil pencarian & Route Detail)
├── Notifications                (/notifications)
├── Kirim Report                 (/report/new)
├── Riwayat Report Saya          (/report)
└── Profile / Pengaturan Akun    (/profile)

Admin (memerlukan role Admin)
├── Admin Dashboard              (/admin)
├── Kelola Operators             (/admin/operators)
├── Kelola Transport Types       (/admin/transport-types)
├── Kelola Routes & Route Stops  (/admin/routes)
├── Kelola Stations & Stops      (/admin/stations)
├── Kelola Schedules             (/admin/schedules)
├── Kelola Fares                 (/admin/fares)
├── Kelola Reports               (/admin/reports)
└── Kelola Users                 (/admin/users)
```

> Path di atas bersifat konseptual untuk kebutuhan dokumentasi struktur halaman, bukan implementasi teknis.

---

## 16. Page-by-Page Requirements

### Home (`/`)

- **Tujuan:** Menjawab langsung "mau ke mana, dan kapan harus tiba" (lihat `style.md` §12).
- **Komponen Utama:** Hero + Journey Planner card, kategori moda transportasi singkat, preview peta/area populer.
- **Aksi Utama:** Mengisi Journey Planner → tombol **Cari Perjalanan**.
- **Data Dibutuhkan:** Daftar moda transportasi (untuk kategori singkat).
- **State Khusus:** Tidak memerlukan login untuk mengakses halaman ini.

### Journey Planner & Hasil (`/plan`)

- **Tujuan:** Input pencarian dan menampilkan hasil rekomendasi rute.
- **Komponen Utama:** Form Journey Planner (asal, tujuan, target waktu, preferensi chip), daftar Route Result Cards, ringkasan Arrive On Time.
- **Aksi Utama:** Submit pencarian, memilih preferensi, membuka Route Detail dari salah satu kartu hasil.
- **Data Dibutuhkan:** Hasil Smart Route Recommendation + Arrive On Time.
- **State Khusus:** Loading saat pencarian berjalan; Empty apabila tidak ada rute ditemukan; Error apabila data tidak dapat dimuat (lihat §24).

### Route Detail (`/route/:id`)

- **Tujuan:** Menampilkan rincian satu rute terpilih secara lengkap.
- **Komponen Utama:** Route Timeline vertikal, ringkasan Arrive On Time, tombol simpan sebagai Favorite Trip.
- **Aksi Utama:** Menyimpan sebagai favorit, melihat detail tiap segmen, membuka lokasi pada Interactive Map.
- **Data Dibutuhkan:** Detail route_stops, schedule, dan fare dari rute terkait.

### Interactive Map (`/map`)

- **Tujuan:** Mendukung keputusan secara visual, bukan menjadi antarmuka utama.
- **Komponen Utama:** Peta ringan (light style), marker asal/tujuan/stasiun, kontrol zoom & lokasi saat ini.
- **Aksi Utama:** Melihat rute pada peta, mengganti lapisan (jika ada), kembali ke hasil pencarian.
- **Data Dibutuhkan:** Koordinat stasiun/halte serta rute terpilih.

### Transport Explorer (`/explore`)

- **Tujuan:** Menjelajahi moda, operator, dan rute yang tersedia di Jabodetabek.
- **Komponen Utama:** Filter (Kota, Moda, Operator, Route), kartu transportasi (lihat `style.md` §17).
- **Aksi Utama:** Memfilter daftar, membuka detail rute (Route Detail).
- **Data Dibutuhkan:** Daftar operator, transport type, dan routes.

### Login / Register (`/login`, `/register`)

- **Tujuan:** Autentikasi pengguna.
- **Komponen Utama:** Form email/kata sandi, tautan antar halaman login-register.
- **Aksi Utama:** Submit form, validasi input.
- **State Khusus:** Pesan error yang jelas untuk kredensial salah atau email sudah terdaftar.

### My Trips (`/trips`)

- **Tujuan:** Mengelola perjalanan favorit (lihat `style.md` §18).
- **Komponen Utama:** Daftar kartu perjalanan tersimpan, tombol "Mulai Perjalanan".
- **Aksi Utama:** Ganti nama, hapus favorit, mulai ulang pencarian.
- **State Khusus:** Empty state apabila belum ada perjalanan tersimpan.

### My Schedule (`/schedule`)

- **Tujuan:** Mengelola rutinitas perjalanan berulang (lihat `style.md` §19).
- **Komponen Utama:** Daftar kartu jadwal (nama, hari, target tiba, jam berangkat rekomendasi).
- **Aksi Utama:** Tambah/edit/nonaktifkan jadwal.
- **State Khusus:** Empty state apabila belum ada jadwal dibuat.

### Notifications (`/notifications`)

- **Tujuan:** Pusat notifikasi dalam aplikasi.
- **Komponen Utama:** Daftar notifikasi dengan status baca/belum dibaca.
- **Prioritas:** NICE TO HAVE.

### Kirim Report / Riwayat Report (`/report/new`, `/report`)

- **Tujuan:** Pelaporan data tidak akurat dan pelacakan status laporan sendiri.
- **Komponen Utama:** Form jenis laporan + deskripsi, daftar riwayat laporan dengan status.

### Profile (`/profile`)

- **Tujuan:** Pengelolaan data akun dasar.
- **Komponen Utama:** Nama, email, ubah kata sandi, logout.

### Admin Dashboard & Sub-halaman (`/admin/*`)

- **Tujuan:** Mengelola seluruh data acuan sistem (lihat `style.md` §21).
- **Komponen Utama:** Sidebar navigasi, tabel data dengan pencarian/filter/pagination, status badge, dialog konfirmasi hapus.
- **Aksi Utama:** CRUD tiap entitas data acuan; peninjauan & pembaruan status laporan pengguna.
- **Catatan konsistensi desain:** Struktur sidebar mengikuti `style.md` §21 (Dashboard, Users, Operators, Transport Types, Routes, Stations & Stops, Schedules, Fares, Reports). Pengelolaan **Kota (City)** dilakukan sebagai bagian dari form Stations & Stops (bukan menu terpisah), dan pengelolaan **Role** dilakukan sebagai bagian dari form Users, agar struktur sidebar tetap sesuai `style.md` tanpa menambah menu baru yang tidak diperlukan.

---

## 17. Responsive Requirements

Mengikuti breakpoint dan prioritas yang telah ditentukan pada `style.md` §27 (bukan definisi baru):

| Breakpoint | Rentang |
|---|---|
| Mobile | `< 768px` |
| Tablet | `768px – 1023px` |
| Desktop | `>= 1024px` |

**Prioritas konten Mobile** (sesuai `style.md`): Search/Plan → Rute Rekomendasi → Detail Perjalanan → Map → Perjalanan Tersimpan → Informasi Sekunder.

Requirement tambahan khusus PRD ini:

- Navigasi utama menggunakan **bottom navigation** di mobile (`Home · Explore · Plan · Trips · Profile`) dan **navbar horizontal** di desktop, sesuai `style.md` §11.
- Form Journey Planner disusun **vertikal** di mobile dan **horizontal** di desktop, sesuai `style.md` §10.
- Admin Dashboard **tidak dioptimalkan untuk mobile** pada MVP — cukup dapat diakses dan digunakan pada layar tablet ke atas, karena aktivitas pengelolaan data lebih realistis dilakukan di layar besar.
- Peta (Interactive Map) harus tetap dapat digunakan pada layar mobile tanpa memerlukan scroll horizontal.

---

## 18. Authentication & Roles

### Peran (Roles)

| Role | Akses |
|---|---|
| **Guest** | Dapat menggunakan Journey Planner, Smart Route Recommendation, Arrive On Time, Route Detail, Interactive Map, dan Transport Explorer tanpa login. |
| **Registered User** | Seluruh akses Guest, ditambah Favorite Trip, My Trips, My Schedule, Notifications, dan User Report. |
| **Admin** | Seluruh akses Registered User, ditambah akses penuh ke Admin Dashboard. |

### Requirement Autentikasi

- Registrasi menggunakan nama, email, dan kata sandi.
- Login menggunakan email dan kata sandi.
- Kata sandi disimpan dalam bentuk hash (bukan teks biasa) — mekanisme spesifik ditentukan pada tahap desain teknis.
- Sesi pengguna diperlukan untuk mengakses fitur yang memerlukan login (personalisasi & admin), namun **tidak diperlukan** untuk fungsi inti pencarian rute.
- Satu akun hanya memiliki satu role aktif (User atau Admin) pada MVP.
- Reset kata sandi melalui email termasuk **SHOULD HAVE**, bukan MUST HAVE pada MVP (dapat digantikan proses manual/admin pada tahap awal bila diperlukan).

---

## 19. Admin Requirements

Admin Dashboard mengelola seluruh data acuan yang menjadi sumber bagi fitur pengguna, mengikuti struktur `style.md` §21:

| Menu | Data yang Dikelola |
|---|---|
| Dashboard | Ringkasan jumlah rute, stasiun, laporan menunggu tinjauan (statistik pendukung, bukan fitur utama — lihat `style.md` §20). |
| Users | Daftar pengguna terdaftar, status aktif/nonaktif, role. |
| Operators | Data operator transportasi (nama, kontak, dukungan data real-time). |
| Transport Types | Jenis moda transportasi (KRL, MRT, LRT, TransJakarta, dll.). |
| Routes | Data rute per operator/moda, termasuk urutan pemberhentian (route-stop). |
| Stations & Stops | Data stasiun (termasuk kota) dan titik pemberhentian per moda. |
| Schedules | Jadwal keberangkatan/headway per rute. |
| Fares | Tarif per rute atau per segmen rute. |
| Reports | Daftar laporan pengguna beserta status penanganannya. |

Requirement tambahan:

- Admin harus dapat melihat data dalam bentuk tabel dengan pencarian, filter, dan pagination (`style.md` §21).
- Setiap aksi hapus data harus melalui dialog konfirmasi.
- Sistem harus mencegah penghapusan data yang masih digunakan entitas lain tanpa konfirmasi eksplisit (lihat `ERD.md` — rekomendasi *on delete*).
- Admin **tidak** dapat menghapus akunnya sendiri melalui Admin Dashboard.

---

## 20. Route Planning Logic

Logika berikut dijelaskan secara fungsional, **tanpa implementasi kode**.

1. **Penentuan titik asal/tujuan** — Input pengguna dipetakan ke stasiun/halte terdekat yang tersedia dalam data (stations/stops).
2. **Pencarian kandidat rute langsung** — Sistem memeriksa apakah ada satu rute yang melalui titik asal maupun tujuan secara berurutan (berdasarkan data route-stop).
3. **Pencarian kandidat rute dengan transit** — Apabila rute langsung tidak tersedia atau bukan opsi terbaik, sistem mencari kombinasi rute yang terhubung melalui satu atau lebih titik transit, termasuk kemungkinan segmen berjalan kaki antar titik pemberhentian yang berdekatan.
4. **Perhitungan estimasi durasi** — Total durasi dihitung dari akumulasi waktu tempuh antar pemberhentian, waktu tunggu berdasarkan jadwal/headway, dan estimasi waktu transit/berjalan kaki antar segmen.
5. **Perhitungan estimasi biaya** — Total biaya dihitung dari akumulasi tarif tiap segmen rute yang dilalui.
6. **Perhitungan jumlah transit** — Dihitung dari banyaknya perpindahan rute dalam satu kandidat perjalanan.
7. **Pemeringkatan kandidat** — Kandidat rute diberi skor dan diurutkan berdasarkan preferensi yang dipilih pengguna (Tercepat/Termurah/Minim Transit/Minim Jalan Kaki/Paling Nyaman).
8. **Penyajian hasil** — Sistem menampilkan sejumlah kandidat rute terbaik, masing-masing dapat dibuka sebagai Route Detail.

**Batasan yang harus dikomunikasikan ke pengguna:** akurasi hasil bergantung pada kelengkapan data statis (jadwal, tarif) yang dikelola Admin, serta sistem tidak menjamin data posisi real-time dari seluruh operator (lihat §21 dan Aturan Penting #13).

---

## 21. Arrive On Time Logic

Ini adalah logika di balik *fitur wow* TRANSIT, dijelaskan secara fungsional tanpa implementasi kode.

### Input

- Lokasi asal
- Lokasi tujuan
- Target waktu tiba
- Preferensi perjalanan

### Proses

1. Jalankan **Smart Route Recommendation** (§20) untuk memperoleh kandidat rute beserta estimasi durasi masing-masing.
2. Untuk setiap kandidat rute, hitung waktu berangkat secara mundur:

   ```
   Waktu Berangkat = Target Waktu Tiba − Estimasi Durasi Total − Buffer Time
   ```

3. Tentukan **Buffer Time**: nilai dasar (misalnya beberapa menit) yang bertambah secara proporsional terhadap jumlah transit pada rute tersebut, untuk mengantisipasi keterlambatan sambungan antar moda. Nilai pasti buffer ditentukan pada tahap desain teknis, bukan pada dokumen ini.
4. Bandingkan **Waktu Berangkat** hasil perhitungan dengan waktu saat ini:
   - Jika masih di masa depan → tampilkan sebagai rekomendasi aktif.
   - Jika sudah lewat → tandai status "waktu berangkat sudah lewat" dan tampilkan estimasi keterlambatan menggunakan rute tercepat yang tersedia.
5. Susun hasil akhir untuk ditampilkan:
   - Rekomendasi waktu berangkat
   - Estimasi waktu tiba
   - Total durasi
   - Jumlah transit
   - Estimasi biaya
   - Buffer time
   - Rincian tiap segmen perjalanan (diteruskan ke Route Detail)

### Kondisi Khusus (Edge Cases)

| Kondisi | Perilaku Sistem |
|---|---|
| Tidak ada jadwal terperinci untuk rute (hanya headway) | Estimasi tetap ditampilkan, dengan indikator "estimasi berdasarkan perkiraan headway". |
| Tidak ada rute yang dapat memenuhi target waktu tiba | Tampilkan rute tercepat yang tersedia beserta estimasi selisih keterlambatan terhadap target. |
| Target waktu tiba kurang dari waktu saat ini + estimasi durasi minimum | Tampilkan peringatan bahwa target tidak realistis, sertakan opsi rute tercepat. |
| Operator terkait tidak menyediakan data real-time | Sistem tetap menggunakan data jadwal statis, dengan indikator "estimasi non-real-time" (lihat Aturan Penting #13). |

---

## 22. Search & Filter Requirements

### Journey Planner

Urutan input mengikuti `style.md` §10:

1. Asal (From)
2. Tujuan (To)
3. Preferensi arah waktu (Berangkat pukul / Tiba sebelum pukul)
4. Waktu (Time)
5. Preferensi perjalanan (chip: Tercepat, Termurah, Minim Transit, Minim Jalan Kaki, Paling Nyaman)
6. Aksi pencarian

**Validasi:**

- Asal dan Tujuan wajib diisi dan tidak boleh sama.
- Target waktu wajib diisi.
- Preferensi memiliki nilai default (misalnya Tercepat) apabila tidak dipilih secara eksplisit.

### Transport Explorer

Filter yang tersedia (`style.md` §17): **Kota**, **Moda**, **Operator**, **Route**. Filter dapat dikombinasikan (AND), dan hasil diperbarui tanpa memuat ulang seluruh halaman.

---

## 23. Map Requirements

Mengikuti `style.md` §16:

- Peta berfungsi sebagai **pendukung keputusan**, bukan antarmuka utama.
- Elemen yang ditampilkan: lokasi pengguna, titik asal, titik tujuan, stasiun/halte terkait, rute terpilih, dan opsional rute alternatif.
- Gaya peta menggunakan tampilan terang (*light style*) agar konsisten dengan UI utama.
- Panel overlay di atas peta menggunakan permukaan putih dengan hierarki yang jelas.
- Kontrol peta dibatasi pada: zoom, lokasi saat ini, dan lapisan (opsional) — hindari tombol mengambang berlebihan.
- Sumber data peta: **React Leaflet** dengan **OpenStreetMap**, sesuai tech stack yang ditentukan.

---

## 24. Error / Empty / Loading States

Setiap halaman inti wajib memiliki tiga kondisi non-happy-path, mengikuti prinsip `style.md` §29.

| Halaman | Loading | Empty | Error |
|---|---|---|---|
| Hasil Journey Planner | Skeleton kartu hasil rute | "Tidak ditemukan rute untuk pencarian ini." + saran ubah preferensi/waktu | "Data rute tidak dapat dimuat." + tombol Coba Lagi |
| Route Detail | Skeleton timeline | — (selalu memiliki data bila diakses dari hasil valid) | "Detail rute tidak dapat dimuat." + tombol Coba Lagi |
| My Trips | Skeleton daftar kartu | "Belum ada perjalanan tersimpan." + tombol Cari Perjalanan | "Data perjalanan tersimpan tidak dapat dimuat." + tombol Coba Lagi |
| My Schedule | Skeleton daftar kartu | "Belum ada jadwal dibuat." + tombol Tambah Jadwal | "Data jadwal tidak dapat dimuat." + tombol Coba Lagi |
| Interactive Map | Indikator memuat peta | — | "Peta tidak dapat dimuat." + tombol Coba Lagi |
| Transport Explorer | Skeleton kartu transportasi | "Tidak ada hasil untuk filter ini." + tombol Reset Filter | "Data transportasi tidak dapat dimuat." + tombol Coba Lagi |
| Admin — Tabel data | Skeleton baris tabel | "Belum ada data." + tombol Tambah Data | "Data tidak dapat dimuat." + tombol Coba Lagi |

Prinsip umum: **tidak boleh ada layar kosong tanpa penjelasan**, dan setiap pesan error harus disertai aksi pemulihan (retry atau navigasi relevan).

---

## 25. Accessibility

Mengikuti standar minimum `style.md` §28:

- Kontras teks terhadap latar harus kuat dan mudah dibaca.
- Status fokus keyboard harus terlihat jelas pada seluruh elemen interaktif.
- Semua tombol dan input harus memiliki label yang jelas (termasuk untuk pembaca layar).
- Informasi status (Success/Warning/Danger) tidak boleh disampaikan hanya melalui warna — selalu disertai teks/ikon (`style.md` §23).
- Target sentuh (touch target) minimal sekitar **44px**.
- Struktur heading harus semantik dan berurutan (H1 → H2 → H3).
- Ikon interaktif harus memiliki nama aksesibel (accessible name), bukan hanya ikon visual.
- Pesan error harus menjelaskan apa yang perlu diperbaiki pengguna, bukan sekadar "terjadi kesalahan".

---

## 26. Performance Requirements

Target berikut ditetapkan sebagai acuan realistis untuk proyek sekolah dengan kualitas prototype:

| Aspek | Target |
|---|---|
| Waktu muat halaman awal (Home) | < 3 detik pada koneksi 4G standar |
| Waktu tampil hasil Journey Planner | < 2 detik setelah submit (untuk data yang telah tersedia di database) |
| Interaksi peta (pan/zoom) | Terasa halus, tanpa jeda yang mengganggu pengguna |
| Tabel Admin dengan data besar | Menggunakan pagination, bukan memuat seluruh data sekaligus |
| Aset gambar/ikon | Dioptimalkan (ukuran wajar, format efisien) agar tidak memperlambat muat halaman |

---

## 27. Security Requirements

- Kata sandi pengguna **wajib** disimpan dalam bentuk hash, tidak pernah sebagai teks biasa.
- Seluruh komunikasi antara klien dan server **wajib** menggunakan HTTPS pada lingkungan produksi.
- Akses ke fungsi Admin Dashboard **wajib** diverifikasi berdasarkan role di sisi server, bukan hanya disembunyikan di sisi tampilan (UI).
- Seluruh input dari pengguna (form pencarian, form laporan, form admin) **wajib** divalidasi dan disaring dari kemungkinan input berbahaya sebelum disimpan ke database.
- Percobaan login yang gagal berulang kali **sebaiknya** dibatasi (rate limiting) untuk mencegah percobaan menebak kata sandi.
- Sesi pengguna **wajib** memiliki masa berlaku (session/token expiry) dan dapat diakhiri melalui logout.
- Data pribadi pengguna (email, riwayat perjalanan, jadwal) **tidak boleh** dapat diakses oleh pengguna lain selain pemiliknya dan Admin.
- Aktivitas penghapusan/pengubahan data penting oleh Admin **sebaiknya** tercatat (audit trail) — termasuk kategori SHOULD HAVE untuk pengembangan lanjutan.

---

## 28. MVP Scope

MVP TRANSIT mencakup seluruh fitur berkategori **MUST HAVE** pada §12, yaitu:

- Authentication (Guest, Registered User, Admin)
- Journey Planner
- Smart Route Recommendation
- Arrive On Time
- Route Detail
- Interactive Map
- Transport Explorer
- Admin Dashboard (pengelolaan Operators, Transport Types, Routes & Route Stops, Stations & Stops, Schedules, Fares, Reports, Users)

**Fitur SHOULD HAVE** (Favorite Trip, My Trips, My Schedule, User Report) **dianjurkan** untuk turut dikerjakan bila waktu pengerjaan memadai, karena secara fungsional saling melengkapi dan menggunakan struktur data yang sama dengan MVP inti — namun aplikasi tetap dapat berfungsi dan didemonstrasikan tanpa fitur-fitur ini.

**Fitur NICE TO HAVE** (Notifications) **tidak wajib** dikerjakan pada tahap MVP.

---

## 29. Future Scope

Hal-hal berikut secara sadar **tidak dikerjakan** pada tahap ini, namun didokumentasikan sebagai arah pengembangan lanjutan:

- Integrasi data real-time langsung dari operator (bila operator menyediakan API publik di masa depan).
- Notifikasi push (di luar notifikasi dalam aplikasi).
- Aplikasi native mobile (Android/iOS).
- Dukungan multi-bahasa (misalnya Bahasa Inggris).
- Integrasi pembayaran/tiket elektronik.
- Riwayat perjalanan & statistik penggunaan pribadi.
- Mode aksesibilitas tambahan untuk pengguna berkebutuhan khusus (misalnya preferensi rute ramah disabilitas).
- Validasi data kolaboratif berbasis komunitas (crowdsourced verification) untuk laporan pengguna.
- Rekomendasi berbasis kebiasaan pengguna (personalisasi lanjutan) — **sengaja ditunda** agar tidak menjadi fitur AI yang tidak dibutuhkan pada tahap ini, sesuai batasan proyek.
- Dukungan first-mile/last-mile melalui integrasi moda lain di luar cakupan data saat ini.

---

## 30. Acceptance Criteria

| # | Kriteria (format Given–When–Then) |
|---|---|
| AC-01 | **Given** pengguna mengisi asal, tujuan, dan target waktu tiba yang valid, **When** pengguna menekan Cari Perjalanan, **Then** sistem menampilkan minimal satu rekomendasi rute beserta waktu berangkat, estimasi tiba, durasi, jumlah transit, estimasi biaya, dan buffer time. |
| AC-02 | **Given** tidak ada rute yang tersedia untuk kombinasi asal-tujuan yang dimasukkan, **When** pencarian dijalankan, **Then** sistem menampilkan pesan kondisi kosong beserta saran tindakan, bukan layar kosong. |
| AC-03 | **Given** waktu berangkat hasil perhitungan sudah lewat dari waktu saat ini, **When** hasil ditampilkan, **Then** sistem menandai status tersebut secara eksplisit dan tetap menyediakan alternatif tercepat. |
| AC-04 | **Given** pengguna baru mengisi form registrasi dengan email yang sudah terdaftar, **When** form disubmit, **Then** sistem menolak pendaftaran dan menampilkan pesan bahwa email sudah digunakan. |
| AC-05 | **Given** pengguna berhasil login, **When** pengguna membuka Route Detail dan menekan simpan sebagai favorit, **Then** rute tersebut muncul pada halaman My Trips. |
| AC-06 | **Given** pengguna belum login, **When** pengguna mencoba menyimpan rute sebagai favorit, **Then** sistem mengarahkan pengguna ke halaman login tanpa kehilangan hasil pencarian. |
| AC-07 | **Given** pengguna membuat jadwal pada My Schedule dengan target jam tiba dan hari tertentu, **When** jadwal disimpan, **Then** sistem menampilkan rekomendasi waktu berangkat awal untuk jadwal tersebut. |
| AC-08 | **Given** Admin menambahkan rute baru tanpa mengisi pemberhentian (route-stop), **When** Admin mencoba menyimpan sebagai aktif, **Then** sistem menampilkan pesan validasi dan mencegah rute berstatus aktif hingga data lengkap. |
| AC-09 | **Given** pengguna mengirim User Report dengan jenis dan deskripsi laporan, **When** laporan disubmit, **Then** laporan tersimpan dengan status "Menunggu" dan dapat dilihat pengguna pada riwayat laporannya. |
| AC-10 | **Given** Admin memperbarui status suatu laporan menjadi "Selesai", **When** perubahan disimpan, **Then** status yang ditampilkan pada riwayat laporan milik pengguna terkait ikut diperbarui. |
| AC-11 | **Given** pengguna memfilter Transport Explorer berdasarkan Kota dan Moda tertentu, **When** filter diterapkan, **Then** daftar hasil hanya menampilkan rute yang sesuai kedua filter tersebut sekaligus. |
| AC-12 | **Given** pengguna mengakses TRANSIT melalui layar mobile (< 768px), **When** membuka Journey Planner, **Then** seluruh input ditampilkan tersusun vertikal dan tetap dapat dioperasikan tanpa scroll horizontal. |
| AC-13 | **Given** pengguna dengan role Registered User mencoba mengakses halaman Admin Dashboard, **When** halaman dibuka, **Then** sistem menolak akses tersebut. |

---

*Akhir dokumen PRD.md*
