#!/bin/bash
# Đóng gói bộ bảng vl2_ cho ngày ra mắt (docs/the7/GOI-RA-MAT.md). Chạy trên máy làm việc có MariaDB cục bộ, KHÔNG nối CSDL thật.
#   1. tools/the7_doi_tien_to.py: velis_ → vl2_, staging → site thật (thường / serialized / mã hóa URL / base64);
#   2. nhập vào CSDL thử vl2_goi, tools/the7_sua_ra_mat.php sửa cài đặt chỉ dành cho staging (mã bảo mật form → <ra>/ma-bao-mat-form-the7.txt);
#   3. xuất lại → <ra>/vl2.sql.gz (chỉ bảng vl2_, không LOCK / ALTER), tự kiểm (tools/the7_kiem_goi_sql.py);
#   4. thử nhập vào CSDL vl2_thu đã có sẵn bộ velis_ (bản xuất staging gốc, đóng vai site thật): 46 bảng vl2_, checksum velis_ không đổi.
# Dùng: tools/the7_dong_goi_ra_mat.sh <bản xuất UpdraftPlus -db.gz> <thư mục ra (ngoài repo)> [--giu-user]
set -euo pipefail
VAO=$1; RA=$2; GIU=${3:-}
GOC=$(cd "$(dirname "$0")/.." && pwd)
case "$(realpath -m "$RA")" in "$GOC"*) echo "thư mục ra phải nằm ngoài repo (tệp SQL không commit)"; exit 2;; esac
mkdir -p "$RA"; umask 077
python3 -I "$GOC/tools/the7_doi_tien_to.py" "$VAO" "$RA/vl2-tho.sql.gz"
mariadb -e "DROP DATABASE IF EXISTS vl2_goi; CREATE DATABASE vl2_goi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci"
zcat "$RA/vl2-tho.sql.gz" | mariadb vl2_goi
php "$GOC/tools/the7_sua_ra_mat.php" vl2_goi "$RA/ma-bao-mat-form-the7.txt" $GIU
# --skip-add-locks / --skip-disable-keys: không LOCK TABLES, không ALTER TABLE; dòng "sandbox" của mariadb-dump mới bỏ cho phpMyAdmin cũ
mariadb-dump --skip-lock-tables --skip-add-locks --skip-disable-keys --no-tablespaces --skip-comments \
  --default-character-set=utf8mb4 vl2_goi | sed '1{/sandbox mode/d}' | gzip -9 > "$RA/vl2.sql.gz"
python3 -I "$GOC/tools/the7_kiem_goi_sql.py" "$RA/vl2.sql.gz"
# thử nhập cạnh bộ velis_
mariadb -e "DROP DATABASE IF EXISTS vl2_thu; CREATE DATABASE vl2_thu CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci"
zcat "$VAO" | mariadb vl2_thu
ck() { mariadb -N vl2_thu -e "SELECT GROUP_CONCAT(table_name ORDER BY table_name) FROM information_schema.tables WHERE table_schema='vl2_thu' AND table_name LIKE 'velis\_%'" \
  | tr ',' '\n' | while read -r t; do mariadb -N vl2_thu -e "CHECKSUM TABLE \`$t\`"; done | md5sum; }
TRUOC=$(ck)
zcat "$RA/vl2.sql.gz" | mariadb vl2_thu
SAU=$(ck)
mariadb -N vl2_thu -e "SELECT CONCAT('bảng velis_: ', SUM(table_name LIKE 'velis\_%'), ' | bảng vl2_: ', SUM(table_name LIKE 'vl2\_%')) FROM information_schema.tables WHERE table_schema='vl2_thu'"
[ "$TRUOC" = "$SAU" ] && echo "checksum bộ velis_ trước = sau nhập: ĐẠT" || { echo "checksum bộ velis_ ĐỔI: TRƯỢT"; exit 1; }
ls -l "$RA/vl2.sql.gz"
