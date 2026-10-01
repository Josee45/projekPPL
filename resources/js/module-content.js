export const moduleChapters = [
    {
        id: "classification",
        number: 1,
        title: "Klasifikasi Bilangan",
        subtitle: "Bulat, rasional, irasional, real, dan kompleks",
        objectives: [
            "Menjelaskan pengertian dan hubungan antarhimpunan bilangan.",
            "Mengklasifikasikan bilangan berdasarkan nilainya.",
            "Membedakan bilangan real dari kompleks nonreal.",
        ],
        concepts: [
            [
                "Bilangan Bulat",
                "ℤ = {…, −2, −1, 0, 1, 2, …}",
                "Bilangan bulat memuat bilangan negatif tanpa bagian pecahan, nol, dan bilangan positif tanpa bagian pecahan. Nilai menentukan jenisnya; 12/3 tetap bulat karena bernilai 4.",
            ],
            [
                "Bilangan Rasional",
                "ℚ = {p/q | p,q ∈ ℤ, q ≠ 0}",
                "Bilangan rasional dapat ditulis sebagai pecahan dua bilangan bulat dengan penyebut tidak nol. Desimalnya berhenti atau berulang, misalnya 0,375 = 3/8.",
            ],
            [
                "Irasional dan Real",
                "ℝ = ℚ ∪ I,  ℚ ∩ I = ∅",
                "Bilangan irasional tidak dapat ditulis sebagai pecahan dua bilangan bulat. Setiap bilangan real tepat termasuk rasional atau irasional. √25 rasional, sedangkan √2 irasional.",
            ],
            [
                "Kompleks sebagai Pembanding",
                "z = a + bi,  i² = −1",
                "Bilangan kompleks dengan b = 0 merupakan bilangan real. Jika b ≠ 0, bilangan tersebut kompleks nonreal. Hubungannya adalah ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ.",
            ],
        ],
        examples: [
            [
                "Desimal berhenti",
                "0,375 = 375/1000 = 3/8",
                "Tiga angka desimal memberi penyebut 1000, lalu pecahan disederhanakan.",
            ],
            [
                "Desimal berulang",
                "0,454545… = 5/11",
                "Misalkan x = 0,4545…, kalikan 100, kurangkan x, lalu selesaikan 99x = 45.",
            ],
            [
                "Periksa nilainya",
                "√36 = 6 tetapi √5 irasional",
                "Simbol akar tidak otomatis membuat suatu bilangan irasional.",
            ],
        ],
        activity: {
            title: "Aktivitas Mengelompokkan Bilangan",
            prompt: "Tentukan semua kategori yang sesuai: bulat, rasional, irasional, real, atau kompleks.",
            items: [
                "−4 dan 0",
                "7/2 dan √36",
                "√5 dan 0,121212…",
                "3−2i dan 5+0i",
            ],
            note: "Sederhanakan nilainya lebih dahulu. Satu bilangan dapat masuk ke beberapa himpunan sekaligus.",
        },
        summary: [
            "Bulat merupakan bagian dari rasional.",
            "Rasional dan irasional membagi himpunan real menjadi dua bagian yang tidak beririsan.",
            "Setiap real adalah kompleks dengan bagian imajiner nol.",
            "Klasifikasi ditentukan oleh nilai, bukan sekadar bentuk simbol.",
        ],
        quiz: [
            [
                "Himpunan paling khusus yang memuat −7 adalah …",
                ["Irasional", "Bulat", "Nonreal", "Rasional bukan bulat"],
                1,
                "−7 merupakan bilangan bulat; bilangan bulat juga rasional dan real.",
            ],
            [
                "0,272727… dengan blok 27 berulang termasuk …",
                ["Irasional", "Rasional", "Bulat", "Nonreal"],
                1,
                "Desimal berulang dapat ditulis 27/99 = 3/11.",
            ],
            [
                "Bilangan yang irasional adalah …",
                ["√49", "0,125", "√7", "−9/3"],
                2,
                "√7 tidak dapat dinyatakan sebagai pecahan dua bilangan bulat.",
            ],
            [
                "Mengapa setiap bilangan bulat merupakan rasional?",
                [
                    "Semua bulat positif",
                    "Setiap k dapat ditulis k/1",
                    "Rasional tanpa minus",
                    "Setiap bulat memiliki akar bulat",
                ],
                1,
                "Penyebut 1 adalah bilangan bulat dan tidak nol.",
            ],
            [
                "Untuk z = 4−2i, bagian real dan koefisien imajinernya adalah …",
                ["4 dan −2", "4 dan 2", "−2 dan 4", "4 dan −2i"],
                0,
                "Pada bentuk a+bi, bagian real adalah a dan koefisien imajiner adalah b.",
            ],
            [
                "Bilangan yang real sekaligus kompleks adalah …",
                ["2+i", "−3i", "5+0i", "i"],
                2,
                "Koefisien imajinernya nol sehingga nilainya real.",
            ],
            [
                "Jika r = √2, maka r·r adalah …",
                [
                    "Irasional",
                    "Rasional bernilai 2",
                    "Nonreal",
                    "Tidak terdefinisi",
                ],
                1,
                "√2·√2 = 2; hasil kali dua irasional dapat rasional.",
            ],
            [
                "Pernyataan yang benar adalah …",
                [
                    "Setiap rasional bulat",
                    "Rasional dan irasional beririsan",
                    "Setiap real rasional atau irasional",
                    "Setiap kompleks real",
                ],
                2,
                "Rasional dan irasional membagi himpunan real tanpa irisan.",
            ],
            [
                "x² = −9 tidak mempunyai solusi real karena …",
                [
                    "Negatif tidak dapat dijumlahkan",
                    "Kuadrat real tidak negatif",
                    "Semua akar harus bulat",
                    "−9 bukan bulat",
                ],
                1,
                "Kuadrat setiap bilangan real selalu tidak negatif.",
            ],
            [
                "Mengapa √16 bukan irasional?",
                [
                    "Semua akar rasional",
                    "√16 = 4 = 4/1",
                    "16 positif",
                    "Akar selalu bulat",
                ],
                1,
                "Nilainya 4 dan dapat ditulis sebagai pecahan dua bilangan bulat.",
            ],
        ],
    },
    {
        id: "field",
        number: 2,
        title: "Sifat-Sifat Medan",
        subtitle: "Komutatif, asosiatif, distributif, identitas, dan invers",
        objectives: [
            "Membedakan komutatif, asosiatif, dan distributif.",
            "Menentukan identitas dan invers dengan syarat yang tepat.",
            "Menjelaskan alasan setiap langkah penyederhanaan.",
        ],
        concepts: [
            [
                "Komutatif",
                "a+b=b+a,  ab=ba",
                "Komutatif mengubah urutan dua bilangan. Pengurangan dan pembagian umumnya tidak komutatif.",
            ],
            [
                "Asosiatif",
                "(a+b)+c=a+(b+c)",
                "Asosiatif mengubah pengelompokan tanpa mengubah urutan. Sifat ini berlaku pada penjumlahan dan perkalian real.",
            ],
            [
                "Distributif",
                "a(b+c)=ab+ac",
                "Distributif menghubungkan perkalian dengan penjumlahan. Aturan ini dapat digunakan untuk mengembangkan maupun memfaktorkan.",
            ],
            [
                "Identitas dan Invers",
                "a+0=a, a·1=a",
                "Identitas penjumlahan adalah 0 dan identitas perkalian adalah 1. Invers perkalian 1/a hanya ada untuk a ≠ 0.",
            ],
        ],
        examples: [
            [
                "Asosiatif",
                "25(4·7)=(25·4)7=700",
                "Pengelompokan berubah, tetapi urutan faktor tetap.",
            ],
            [
                "Distributif",
                "−3(2x−5)=−6x+15",
                "Faktor −3 harus mengalikan setiap suku di dalam kurung.",
            ],
            [
                "Dua jenis invers",
                "−3/4 + 3/4 = 0; (−3/4)(−4/3)=1",
                "Nama operasi menentukan identitas yang harus dihasilkan.",
            ],
        ],
        activity: {
            title: "Aktivitas Mencocokkan Sifat",
            prompt: "Tentukan sifat dan alasan pada setiap perubahan.",
            items: [
                "x+7=7+x",
                "(xy)z=x(yz)",
                "5(a+b)=5a+5b",
                "x+0=x; x+(−x)=0; x(1/x)=1",
            ],
            note: "Periksa apakah yang berubah adalah urutan, pengelompokan, atau distribusi faktor.",
        },
        summary: [
            "Komutatif mengubah urutan; asosiatif mengubah pengelompokan.",
            "Distributif menghubungkan perkalian dan penjumlahan.",
            "Setiap real memiliki invers penjumlahan; hanya real tidak nol memiliki invers perkalian.",
            "Pengurangan dan pembagian tidak otomatis memiliki sifat yang sama.",
        ],
        quiz: [
            [
                "a+b=b+a menyatakan hukum …",
                ["Asosiatif", "Komutatif", "Distributif", "Invers"],
                1,
                "Komutatif mengubah urutan operand.",
            ],
            [
                "(a+b)+c=a+(b+c) menyatakan hukum …",
                ["Asosiatif", "Komutatif", "Identitas", "Urutan"],
                0,
                "Asosiatif mengubah pengelompokan tanpa mengubah urutan.",
            ],
            [
                "Bentuk setara dengan 3(x+4) adalah …",
                ["3x+4", "x+12", "3x+12", "7x"],
                2,
                "Faktor 3 mengalikan setiap suku.",
            ],
            [
                "Elemen identitas penjumlahan adalah …",
                ["1", "−1", "0", "Setiap bilangan"],
                2,
                "Menambahkan nol tidak mengubah nilai.",
            ],
            [
                "Invers penjumlahan dari −8 adalah …",
                ["−1/8", "8", "1/8", "0"],
                1,
                "−8+8=0.",
            ],
            [
                "Invers perkalian dari −2/3 adalah …",
                ["2/3", "−3/2", "3/2", "−2/3"],
                1,
                "Hasil kali −2/3 dan −3/2 adalah 1.",
            ],
            [
                "Pernyataan tepat tentang nol adalah …",
                [
                    "Invers kalinya nol",
                    "Invers kalinya satu",
                    "Tidak mempunyai invers perkalian",
                    "Tidak mempunyai invers penjumlahan",
                ],
                2,
                "Tidak ada x yang membuat 0x=1.",
            ],
            [
                "Contoh pengurangan tidak komutatif adalah …",
                ["2+5=5+2", "2−5≠5−2", "2·5=5·2", "2(5+1)=10+2"],
                1,
                "2−5 dan 5−2 menghasilkan nilai berbeda.",
            ],
            [
                "25(4·7)=(25·4)7 memakai hukum …",
                ["Distributif", "Identitas", "Asosiatif perkalian", "Invers"],
                2,
                "Yang berubah hanya pengelompokan faktor.",
            ],
            [
                "Mengapa ℤ bukan medan?",
                [
                    "Tidak memuat nol",
                    "Tidak komutatif",
                    "2 tidak punya invers perkalian di ℤ",
                    "Tidak tertutup pada penjumlahan",
                ],
                2,
                "Invers perkalian 2 adalah 1/2, yang bukan bilangan bulat.",
            ],
        ],
    },
    {
        id: "order",
        number: 3,
        title: "Sifat-Sifat Urutan",
        subtitle: "Trikotomi, ketransitifan, penambahan, dan perkalian",
        objectives: [
            "Menjelaskan trikotomi dan ketransitifan.",
            "Mengubah pertidaksamaan dengan memperhatikan tanda faktor.",
            "Menyelesaikan dan memeriksa pertidaksamaan sederhana.",
        ],
        concepts: [
            [
                "Trikotomi",
                "a<b atau a=b atau a>b",
                "Untuk setiap dua real, tepat satu dari tiga hubungan berlaku. Bilangan di kanan pada garis bilangan bernilai lebih besar.",
            ],
            [
                "Ketransitifan",
                "a<b dan b<c ⇒ a<c",
                "Perbandingan dapat dihubungkan secara berantai, termasuk pada hubungan lebih besar dan perbandingan tidak ketat.",
            ],
            [
                "Sifat Penambahan",
                "a<b ⇒ a+c<b+c",
                "Menambahkan atau mengurangkan bilangan yang sama pada kedua ruas mempertahankan arah pertidaksamaan.",
            ],
            [
                "Sifat Perkalian",
                "c>0: ac<bc; c<0: ac>bc",
                "Faktor positif mempertahankan arah, faktor negatif membalik arah, dan faktor nol menghilangkan informasi urutan.",
            ],
        ],
        examples: [
            [
                "Penambahan",
                "x−5<2 ⇒ x<7",
                "Tambahkan 5 pada kedua ruas; arah tanda tetap.",
            ],
            [
                "Faktor negatif",
                "−4x<12 ⇒ x>−3",
                "Pembagian dengan −4 membalik arah pertidaksamaan.",
            ],
            [
                "Bertahap",
                "5−2x≥11 ⇒ −2x≥6 ⇒ x≤−3",
                "Kurangi 5, kemudian bagi dengan −2 dan balik tanda.",
            ],
        ],
        activity: {
            title: "Aktivitas Perubahan Urutan",
            prompt: "Mulai dari −2<1. Bandingkan hasil setelah kedua ruas dikalikan faktor berikut.",
            items: [
                "c=3 dan c=1/2",
                "c=−2 dan c=−1/2",
                "c=0",
                "Analisis kesalahan: −3x<6 disimpulkan x<−2",
            ],
            note: "Sebelum mengalikan atau membagi, tentukan apakah faktornya positif, negatif, atau nol.",
        },
        summary: [
            "Trikotomi menyatakan tepat satu hubungan berlaku.",
            "Ketransitifan menghubungkan perbandingan secara berantai.",
            "Penambahan bilangan sama mempertahankan arah.",
            "Perkalian dengan negatif membalik arah; nol menghilangkan informasi.",
        ],
        quiz: [
            [
                "Trikotomi menyatakan …",
                [
                    "Ketiga hubungan berlaku",
                    "Tepat satu hubungan berlaku",
                    "Selalu a<b",
                    "Selalu a=b",
                ],
                1,
                "Tepat satu dari <, =, atau > berlaku.",
            ],
            [
                "Jika p<q dan q<r, maka …",
                ["p>r", "p=r", "p<r", "Tidak dapat dibandingkan"],
                2,
                "Ini adalah sifat ketransitifan.",
            ],
            [
                "Jika a<b, untuk setiap real c berlaku …",
                ["a+c<b+c", "a+c>b+c", "ac<bc tanpa syarat", "a−c>b−c"],
                0,
                "Menambahkan bilangan yang sama mempertahankan urutan.",
            ],
            [
                "Dari −4<2, kalikan kedua ruas dengan 3 …",
                ["−12>6", "−12<6", "−1<5", "12<6"],
                1,
                "Faktor positif mempertahankan arah.",
            ],
            [
                "Dari −4<2, kalikan kedua ruas dengan −3 …",
                ["12<−6", "−12<6", "12>−6", "4>2"],
                2,
                "Faktor negatif membalik arah.",
            ],
            [
                "Dari −2x<8 diperoleh …",
                ["x<−4", "x>−4", "x<4", "x>4"],
                1,
                "Membagi dengan −2 membalik tanda.",
            ],
            [
                "Jika kedua ruas a<b dikalikan nol …",
                ["0<0", "0>0", "Diperoleh 0=0 dan urutan hilang", "a=b"],
                2,
                "Kedua ruas menjadi nol tanpa menyimpulkan a=b.",
            ],
            [
                "Urutan terkecil ke terbesar adalah …",
                [
                    "−1/2, −2, √2",
                    "√2, −1/2, −2",
                    "−2, −1/2, √2",
                    "−2, √2, −1/2",
                ],
                2,
                "−2 berada paling kiri, lalu −1/2, kemudian √2.",
            ],
            [
                "Penyelesaian 3x+1≤10 adalah …",
                ["x≤3", "x≥3", "x<3", "x>3"],
                0,
                "Kurangi 1 lalu bagi 3 yang positif.",
            ],
            [
                "Untuk a<b<0, yang selalu benar adalah …",
                ["a²<b²", "a²>b²", "a²=b²", "a>b"],
                1,
                "Bilangan a lebih negatif sehingga nilai mutlak dan kuadratnya lebih besar.",
            ],
        ],
    },
    {
        id: "exponents",
        number: 4,
        title: "Eksponen dan Bentuk Akar",
        subtitle: "Pangkat, akar utama, operasi akar, dan rasionalisasi",
        objectives: [
            "Menggunakan sifat pangkat dengan syarat basis yang tepat.",
            "Menghubungkan pangkat rasional dengan akar utama.",
            "Menyederhanakan bentuk akar dan merasionalkan penyebut.",
        ],
        concepts: [
            [
                "Sifat Pangkat",
                "aᵐaⁿ=aᵐ⁺ⁿ; aᵐ/aⁿ=aᵐ⁻ⁿ",
                "Pada perkalian basis sama pangkat dijumlahkan; pada pembagian pangkat dikurangkan dan basis tidak boleh nol.",
            ],
            [
                "Pangkat Nol dan Negatif",
                "a⁰=1; a⁻ⁿ=1/aⁿ, a≠0",
                "Pangkat negatif menyatakan kebalikan, bukan tanda nilai yang negatif.",
            ],
            [
                "Pangkat Rasional",
                "aᵐ/ⁿ = ⁿ√(aᵐ)",
                "Dalam modul, basis positif digunakan agar pangkat rasional terdefinisi secara konsisten.",
            ],
            [
                "Akar Utama",
                "√(x²)=|x|",
                "Akar utama berindeks genap tidak negatif. √9=3, sementara persamaan x²=9 mempunyai solusi ±3.",
            ],
            [
                "Operasi dan Rasionalisasi",
                "p√a+q√a=(p+q)√a",
                "Gabungkan hanya akar sejenis setelah disederhanakan. Rasionalisasi memakai faktor yang sama, sering berupa bentuk sekawan.",
            ],
        ],
        examples: [
            [
                "Pangkat negatif",
                "2⁻³=1/2³=1/8",
                "Tanda negatif pada eksponen menyatakan kebalikan.",
            ],
            [
                "Sederhanakan akar",
                "√50=√(25·2)=5√2",
                "Cari faktor kuadrat sempurna dari radikan.",
            ],
            [
                "Akar sejenis",
                "√12+√27=2√3+3√3=5√3",
                "Sederhanakan dahulu, kemudian jumlahkan koefisien.",
            ],
            [
                "Rasionalisasi",
                "2/(√3+1)=√3−1",
                "Kalikan pembilang dan penyebut dengan sekawan √3−1.",
            ],
        ],
        activity: {
            title: "Aktivitas Pangkat dan Akar",
            prompt: "Susun langkah, sebutkan aturan, dan periksa syaratnya.",
            items: [
                "Sederhanakan (a³a⁻⁵)/a⁻¹ dengan a≠0",
                "Sederhanakan √48+√75−√12",
                "Rasionalkan 1/(√2+1)",
                "Periksa √(x²)=x dan aᵐaⁿ=aᵐⁿ",
            ],
            note: "Periksa basis nol, akar utama, akar sejenis, dan penyebut sebelum memakai aturan.",
        },
        summary: [
            "Pangkat negatif berarti kebalikan.",
            "Akar utama genap tidak negatif dan √(x²)=|x|.",
            "Sederhanakan radikan sebelum menggabungkan akar sejenis.",
            "Rasionalisasi mempertahankan nilai dengan mengalikan faktor yang sama dan tidak nol.",
        ],
        quiz: [
            [
                "Nilai 2³·2⁴ adalah …",
                ["2¹²", "2⁷", "4⁷", "2"],
                1,
                "Pada basis sama, pangkat dijumlahkan.",
            ],
            [
                "Untuk a≠0, a⁵/a² sama dengan …",
                ["a¹⁰", "a⁵/²", "a³", "a⁷"],
                2,
                "Pada pembagian basis sama, pangkat dikurangkan.",
            ],
            [
                "Nilai 5⁻² adalah …",
                ["−25", "−1/25", "1/25", "25"],
                2,
                "Pangkat negatif berarti kebalikan.",
            ],
            [
                "Untuk a≠0, nilai a⁰ adalah …",
                ["0", "1", "a", "Tidak terdefinisi"],
                1,
                "Pangkat nol bernilai satu untuk basis tidak nol.",
            ],
            [
                "Nilai 16³/⁴ adalah …",
                ["4", "6", "8", "12"],
                2,
                "Akar pangkat empat 16 adalah 2, lalu 2³=8.",
            ],
            [
                "Untuk real x, √(x²) sama dengan …",
                ["x untuk semua x", "−x untuk semua x", "|x|", "x²"],
                2,
                "Akar utama tidak negatif.",
            ],
            [
                "Bentuk sederhana √72 adalah …",
                ["6√2", "36√2", "8√9", "2√6"],
                0,
                "72=36·2.",
            ],
            [
                "Hasil 3√5+2√5 adalah …",
                ["5√10", "6√5", "5√5", "√25"],
                2,
                "Radikan sama sehingga koefisien dijumlahkan.",
            ],
            [
                "Hasil (√3+2)(√3−2) adalah …",
                ["1", "−1", "7", "4√3"],
                1,
                "Selisih kuadrat memberi 3−4=−1.",
            ],
            [
                "Bentuk rasional dari 1/√3 adalah …",
                ["√3", "3√3", "√3/3", "1/3"],
                2,
                "Kalikan pembilang dan penyebut dengan √3.",
            ],
        ],
    },
];

export const finalEvaluation = [
    [
        "Himpunan paling khusus yang memuat √81 adalah …",
        ["Bulat", "Irasional", "Nonreal", "Rasional bukan bulat"],
        0,
    ],
    [
        "0,375 termasuk rasional karena …",
        [
            "Memuat koma",
            "Dapat ditulis 3/8",
            "Lebih kecil dari satu",
            "Tidak negatif",
        ],
        1,
    ],
    ["Bilangan nonreal adalah …", ["√5", "−6", "2+0i", "2−i"], 3],
    [
        "Jumlah dua irasional dapat rasional. Contohnya …",
        ["√2+(−√2)=0", "√2+1", "√3+2", "π+1"],
        0,
    ],
    [
        "Pernyataan ℤ⊂ℚ berarti …",
        [
            "Semua rasional bulat",
            "Setiap bulat rasional",
            "Keduanya sama",
            "Tidak beririsan",
        ],
        1,
    ],
    ["Bentuk setara −2(3x−4) adalah …", ["−6x−8", "−6x+8", "6x−8", "−6x+4"], 1],
    [
        "7+(−7)=0 memakai sifat …",
        ["Invers penjumlahan", "Identitas perkalian", "Asosiatif", "Trikotomi"],
        0,
    ],
    ["Invers perkalian dari 4 adalah …", ["−4", "0", "1", "1/4"], 3],
    [
        "(u+v)+w=u+(v+w) memakai hukum …",
        ["Komutatif", "Distributif", "Asosiatif", "Urutan"],
        2,
    ],
    [
        "Mengapa 0 tidak memiliki invers perkalian?",
        [
            "0 bukan real",
            "Hasil 0x selalu 0",
            "Tidak punya invers tambah",
            "Identitas perkalian",
        ],
        1,
    ],
    [
        "Hubungan −3 dan −1 yang benar adalah …",
        ["−3>−1", "−3=−1", "−3<−1", "Tak dapat dibandingkan"],
        2,
    ],
    [
        "Jika a<b dan b<c, kesimpulan a<c memakai …",
        ["Trikotomi", "Ketransitifan", "Komutatif", "Identitas"],
        1,
    ],
    ["Penyelesaian x−4<3 adalah …", ["x<7", "x>7", "x<−1", "x>−1"], 0],
    ["Penyelesaian −3x≥9 adalah …", ["x≥−3", "x≤−3", "x≥3", "x≤3"], 1],
    ["Dari a<b diperoleh ac>bc jika …", ["c>0", "c=0", "c<0", "Setiap c"], 2],
    ["Nilai 3²·3⁻⁴ adalah …", ["1/9", "9", "−9", "3⁻⁸"], 0],
    ["Nilai 27²/³ adalah …", ["3", "6", "9", "18"], 2],
    ["Bentuk sederhana √48 adalah …", ["4√3", "3√4", "16√3", "2√3"], 0],
    ["Hasil √12+√27 adalah …", ["√39", "5√3", "6√3", "3√5"], 1],
    [
        "Bentuk rasional 2/(√5+1) adalah …",
        ["√5−1", "(√5−1)/2", "(√5+1)/2", "2√5−2"],
        1,
    ],
];

export const essayEvaluation = [
    "Klasifikasikan −6, 0,2, √7, dan 1+2i ke semua himpunan yang sesuai. Nilai pernyataan bahwa semua kompleks adalah real.",
    "Sederhanakan 4(2x−3)+3x, jelaskan sifat yang dipakai, lalu tentukan kedua jenis invers dari −5.",
    "Selesaikan 7−3x<16, jelaskan pembalikan tanda, dan uji satu nilai yang memenuhi serta satu yang tidak.",
    "Sederhanakan √75+2√12−√27, rasionalkan 2/(√3+1), dan beri contoh bahwa akar jumlah tidak dapat dipisahkan.",
];
