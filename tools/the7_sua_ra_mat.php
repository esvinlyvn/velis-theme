<?php
/*
 * Sửa cài đặt "chỉ dành cho staging" trong bộ bảng vl2_ ĐÃ NHẬP VÀO CSDL THỬ CỤC BỘ (không bao giờ chạy trên CSDL thật),
 * trước khi xuất lại thành vl2.sql.gz – kế hoạch ra mắt "bật công tắc" (docs/the7/GOI-RA-MAT.md).
 *
 *   blog_public = 1; robots.txt Rank Math = docs/robots-ra-mat.txt (bỏ dòng chú thích);
 *   active_plugins bỏ Password Protected + Velis Staging Guard; Rank Math bật lại module IndexNow (instant-indexing);
 *   WP Mail SMTP tắt "Không gửi" (giữ mailer / tài khoản gửi sẵn có); Header and Footer Scripts = khối của site thật;
 *   The7 (the7 + the7velischild): mã bảo mật form MỚI – ghi vào <tệp mã>, không in ra màn hình;
 *   bỏ bộ nhớ đệm the7_feature_access (thông báo bản quyền tải từ repo.the7.io, chứa tên miền staging mã hóa base64; The7 tự tải lại);
 *   người dùng <bỏ user> (mặc định claude-bot): chuyển bài / bình luận sang người dùng ID 1, xóa usermeta + users.
 *
 * Dùng: php tools/the7_sua_ra_mat.php <tên CSDL thử> <tệp mã bảo mật ra> [--giu-user]
 *       php tools/the7_sua_ra_mat.php --test   (tạo CSDL tạm velis_test_ra_mat, tự xóa)
 */
const P = 'vl2_';
const BO_PLUGIN = ['password-protected/password-protected.php', 'velis-staging-guard/velis-staging-guard.php'];

function db($ten) {
    $d = new mysqli('localhost', 'root', '', $ten, 0, '/run/mysqld/mysqld.sock');
    $d->set_charset('utf8mb4');
    return $d;
}
function lay($d, $n) {
    $s = $d->prepare('SELECT option_value FROM ' . P . 'options WHERE option_name=?'); $s->bind_param('s', $n); $s->execute();
    $r = $s->get_result()->fetch_row();
    if (!$r) throw new RuntimeException("thiếu option $n");
    return $r[0];
}
function dat($d, $n, $v) {
    $s = $d->prepare('UPDATE ' . P . 'options SET option_value=? WHERE option_name=?'); $s->bind_param('ss', $v, $n); $s->execute();
}
function sua_mang($d, $n, callable $f) {
    $v = unserialize(lay($d, $n), ['allowed_classes' => false]);
    if (!is_array($v)) throw new RuntimeException("$n không phải mảng serialized");
    dat($d, $n, serialize($f($v)));
}

function sua($d, $robots, $header, $tep_ma, $bo_user) {
    $log = [];
    dat($d, 'blog_public', '1'); $log[] = 'blog_public=1';
    sua_mang($d, 'active_plugins', function ($a) use (&$log) {
        $b = array_values(array_diff($a, BO_PLUGIN)); $log[] = 'active_plugins ' . count($a) . '→' . count($b); return $b; });
    sua_mang($d, 'rank_math_modules', function ($a) use (&$log) {
        if (!in_array('instant-indexing', $a, true)) { $a[] = 'instant-indexing'; $log[] = 'Rank Math: bật IndexNow'; } return $a; });
    sua_mang($d, 'rank-math-options-general', function ($a) use ($robots, &$log) {
        $a['robots_txt_content'] = $robots; $log[] = 'robots.txt Rank Math (' . strlen($robots) . ' B)'; return $a; });
    sua_mang($d, 'wp_mail_smtp', function ($a) use (&$log) {
        $a['general']['do_not_send'] = false; $log[] = 'WP Mail SMTP: do_not_send=false, mailer=' . ($a['mail']['mailer'] ?? '?'); return $a; });
    dat($d, 'jamify_hfs_insert_header', $header); $log[] = 'Header and Footer Scripts: khối site thật';
    $ma = '';
    $abc = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for ($i = 0; $i < 20; $i++) $ma .= $abc[random_int(0, 35)];
    foreach (['the7', 'the7velischild'] as $n) {
        sua_mang($d, $n, function ($a) use ($ma) { $a['contact_form_security_token'] = $ma; return $a; });
    }
    file_put_contents($tep_ma, $ma . "\n"); chmod($tep_ma, 0600); $log[] = 'The7: mã bảo mật form mới → ' . $tep_ma;
    $d->query('DELETE FROM ' . P . "options WHERE option_name='the7_feature_access'");
    $log[] = 'bỏ bộ nhớ đệm the7_feature_access: ' . $d->affected_rows . ' dòng';
    if ($bo_user !== null) {
        $s = $d->prepare('SELECT ID FROM ' . P . 'users WHERE user_login=?'); $s->bind_param('s', $bo_user); $s->execute();
        $r = $s->get_result()->fetch_row();
        if ($r) {
            $id = (int) $r[0];
            if ($id === 1) throw new RuntimeException('không bỏ user ID 1');
            $d->query('UPDATE ' . P . "posts SET post_author=1 WHERE post_author=$id"); $n1 = $d->affected_rows;
            $d->query('UPDATE ' . P . "comments SET user_id=1 WHERE user_id=$id");
            $d->query('DELETE FROM ' . P . "usermeta WHERE user_id=$id"); $n2 = $d->affected_rows;
            $d->query('DELETE FROM ' . P . "users WHERE ID=$id");
            $log[] = "bỏ user $bo_user (ID $id): $n1 bài chuyển sang ID 1, $n2 usermeta";
        }
    }
    return $log;
}

function robots_ra_mat($tep) {
    $ra = [];
    foreach (file($tep, FILE_IGNORE_NEW_LINES) as $l) if (!str_starts_with($l, '#')) $ra[] = $l;
    return trim(implode("\n", $ra)) . "\n";
}

$goc = dirname(__DIR__);
$a = array_slice($argv, 1);
if ($a === ['--test']) {
    $r = db(''); $r->query('DROP DATABASE IF EXISTS velis_test_ra_mat'); $r->query('CREATE DATABASE velis_test_ra_mat');
    $d = db('velis_test_ra_mat'); $p = P;
    $d->query("CREATE TABLE {$p}options (option_name varchar(191), option_value longtext)");
    $d->query("CREATE TABLE {$p}users (ID int, user_login varchar(60))");
    $d->query("CREATE TABLE {$p}usermeta (user_id int, meta_key varchar(255))");
    $d->query("CREATE TABLE {$p}posts (ID int, post_author int)");
    $d->query("CREATE TABLE {$p}comments (comment_ID int, user_id int)");
    $o = ['blog_public' => '0', 'active_plugins' => serialize(['a/a.php', BO_PLUGIN[0], 'b/b.php', BO_PLUGIN[1]]),
          'rank_math_modules' => serialize(['sitemap']), 'rank-math-options-general' => serialize(['x' => 1]),
          'wp_mail_smtp' => serialize(['mail' => ['mailer' => 'smtp'], 'general' => ['do_not_send' => true]]),
          'jamify_hfs_insert_header' => 'cũ', 'the7' => serialize(['contact_form_security_token' => 'cu']),
          'the7velischild' => serialize(['contact_form_security_token' => 'cu', 'k' => 'v']), 'the7_feature_access' => 'x'];
    foreach ($o as $k => $v) { $s = $d->prepare("INSERT INTO {$p}options VALUES (?,?)"); $s->bind_param('ss', $k, $v); $s->execute(); }
    $d->query("INSERT INTO {$p}users VALUES (1,'admin'),(3,'claude-bot')");
    $d->query("INSERT INTO {$p}usermeta VALUES (1,'vl2_capabilities'),(3,'vl2_capabilities'),(3,'nickname')");
    $d->query("INSERT INTO {$p}posts VALUES (10,3),(11,1)"); $d->query("INSERT INTO {$p}comments VALUES (5,3)");
    $tm = tempnam(sys_get_temp_dir(), 'ma');
    sua($d, robots_ra_mat("$goc/docs/robots-ra-mat.txt"), '<meta x>', $tm, 'claude-bot');
    $u = fn($n) => unserialize(lay($d, $n));
    assert(lay($d, 'blog_public') === '1');
    assert($u('active_plugins') === ['a/a.php', 'b/b.php']);
    assert(in_array('instant-indexing', $u('rank_math_modules'), true));
    $rb = $u('rank-math-options-general')['robots_txt_content'];
    assert(!str_contains($rb, '#') && str_contains($rb, "Sitemap: https://velisrealty.vn/sitemap_index.xml") && !preg_match('/^Disallow: \/$/m', $rb));
    assert($u('wp_mail_smtp')['general']['do_not_send'] === false && $u('wp_mail_smtp')['mail']['mailer'] === 'smtp');
    assert(lay($d, 'jamify_hfs_insert_header') === '<meta x>');
    $ma = trim(file_get_contents($tm));
    assert(preg_match('/^[a-z0-9]{20}$/', $ma) && $u('the7')['contact_form_security_token'] === $ma
        && $u('the7velischild')['contact_form_security_token'] === $ma && $u('the7velischild')['k'] === 'v');
    assert($d->query("SELECT COUNT(*) FROM {$p}options WHERE option_name='the7_feature_access'")->fetch_row()[0] == 0);
    assert($d->query("SELECT COUNT(*) FROM {$p}users")->fetch_row()[0] == 1);
    assert($d->query("SELECT COUNT(*) FROM {$p}usermeta WHERE user_id=3")->fetch_row()[0] == 0);
    assert($d->query("SELECT COUNT(*) FROM {$p}posts WHERE post_author=1")->fetch_row()[0] == 2);
    assert($d->query("SELECT user_id FROM {$p}comments")->fetch_row()[0] == 1);
    unlink($tm); $r->query('DROP DATABASE velis_test_ra_mat');
    echo "test: OK\n"; exit(0);
}
$giu = in_array('--giu-user', $a, true); $a = array_values(array_diff($a, ['--giu-user']));
if (count($a) !== 2) { fwrite(STDERR, "Dùng: php tools/the7_sua_ra_mat.php <CSDL thử> <tệp mã> [--giu-user] | --test\n"); exit(2); }
$header = trim(file_get_contents("$goc/data/the7/ra-mat/header-scripts.html"));
foreach (sua(db($a[0]), robots_ra_mat("$goc/docs/robots-ra-mat.txt"), $header, $a[1], $giu ? null : 'claude-bot') as $l) echo "  $l\n";
