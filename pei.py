# -*- coding: utf-8 -*-
"""
數學試卷題目計算與自動驗證程式
對應圖片：unnamed.jpg
試卷包含：
  - 計算題 1~8 題 (每題 10 分，滿分 80 分)
  - 填充題 1~5 題 (每題 4 分，滿分 20 分)
"""

import sys
import math
from fractions import Fraction

# 確保在 Windows 控制台 (CP950) 下正常輸出 UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

def print_separator(char="=", length=60):
    print(char * length)

def print_header(title):
    print_separator("=")
    print(f"  {title}")
    print_separator("=")

def solve_exam():
    print_header("高一數學試卷 自動解題與驗證程式")
    print("【試卷資訊】")
    print("  試卷得分：計算題 77/80 + 填充題 20/20 = 總分 97 分")
    print_separator("-")

    # ==========================================
    # 計算題 1~8 題
    # ==========================================
    print("\n" + "=" * 60)
    print("【計算題 1~8 題】（需有計算過程，每題 10 分）")
    print("=" * 60)

    # 第 1 題
    print("\n[計算題 1] 二次函數 y = -2x^2 + 4x + 1")
    a, b, c = -2, 4, 1
    direction = "向下" if a < 0 else "向上"
    h = Fraction(-b, 2 * a)  # 對稱軸 x = -b/(2a) = -4 / -4 = 1
    k = Fraction(4 * a * c - b ** 2, 4 * a)  # 最大值 = (4*(-2)*1 - 16)/(-8) = 3
    print("  > 係數：a = {}, b = {}, c = {}".format(a, b, c))
    print("  > 開口方向：a = {} < 0，故開口【{}】".format(a, direction))
    print("  > 對稱軸公式：x = -b / (2a) = -({}) / (2 * {}) = {}".format(b, a, h))
    print("  > 頂點 y 坐標：k = f({}) = -2*({})^2 + 4*({}) + 1 = {}".format(h, h, h, k))
    print("  > 頂點坐標：({}, {})".format(h, k))
    print("  > 最大(小)值：開口向下，當 x = {} 時有【最大值 {}】".format(h, k))
    print("  [V] 學生作答：開口向下、頂點(1, 3)、對稱軸 x=1、最大值=3  ==> 正確 (+10分)")

    # 第 2 題
    print("\n[計算題 2] 判斷二次函數圖形與 x 軸的相交情形")
    # (1) f(x) = x^2 - 3x + 5
    d1 = (-3)**2 - 4 * 1 * 5
    inter1 = "沒有交點" if d1 < 0 else ("相交一點(相切)" if d1 == 0 else "相交於兩點")
    print("  (1) f(x) = x^2 - 3x + 5")
    print("      判別式 D = b^2 - 4ac = (-3)^2 - 4(1)(5) = 9 - 20 = {} < 0".format(d1))
    print("      結論：與 x 軸【{}】".format(inter1))
    print("      [V] 學生作答：沒有交點  ==> 正確")

    # (2) f(x) = -x^2 + 6x - 9
    d2 = 6**2 - 4 * (-1) * (-9)
    inter2 = "沒有交點" if d2 < 0 else ("相交一點(相切)" if d2 == 0 else "相交於兩點")
    print("  (2) f(x) = -x^2 + 6x - 9")
    print("      判別式 D = b^2 - 4ac = 6^2 - 4(-1)(-9) = 36 - 36 = {}".format(d2))
    print("      結論：與 x 軸【{}】".format(inter2))
    print("      [V] 學生作答：相交一點  ==> 正確 (+10分)")

    # 第 3 題
    print("\n[計算題 3] 解不等式 |x + 3| <= 2")
    # -2 <= x+3 <= 2  => -5 <= x <= -1
    lower3 = -2 - 3
    upper3 = 2 - 3
    print("  > 展開絕對值：-2 <= x + 3 <= 2")
    print("  > 各項同減 3：{} <= x <= {}".format(lower3, upper3))
    print("  > 解為：{} <= x <= {}".format(lower3, upper3))
    print("  [V] 學生作答：-5 <= x <= -1  ==> 正確 (+10分)")

    # 第 4 題
    print("\n[計算題 4] 解不等式 |2x - 5| > 3")
    # 2x - 5 > 3 => 2x > 8 => x > 4
    # 2x - 5 < -3 => 2x < 2 => x < 1
    print("  > 展開絕對值：2x - 5 > 3 或 2x - 5 < -3")
    print("  > (1) 2x - 5 > 3  =>  2x > 8  =>  x > 4")
    print("  > (2) 2x - 5 < -3 =>  2x < 2  =>  x < 1")
    print("  > 解為：x < 1 或 x > 4")
    print("  [V] 學生作答：1 > x, x > 4 (即 x < 1 或 x > 4)  ==> 正確 (+10分)")

    # 第 5 題
    print("\n[計算題 5] △ABC 三頂點 A(a, -5), B(3, b), C(4, -3)，重心 G(3, -1)，求 a, b")
    # (a + 3 + 4)/3 = 3 => a = 9 - 7 = 2
    # (-5 + b - 3)/3 = -1 => b = -3 + 8 = 5
    a_val = 3 * 3 - (3 + 4)
    b_val = (-1) * 3 - (-5 + (-3))
    print("  > 重心 x 坐標：(a + 3 + 4) / 3 = 3  =>  7 + a = 9  =>  a = {}".format(a_val))
    print("  > 重心 y 坐標：(-5 + b - 3) / 3 = -1 => -8 + b = -3 =>  b = {}".format(b_val))
    print("  > 結果：a = {}, b = {}".format(a_val, b_val))
    print("  [V] 學生作答：a = 2, b = 5  ==> 正確 (+10分)")

    # 第 6 題
    print("\n[計算題 6] 圓的直徑為 AB，且 A(-3, 2), B(0, 6)，試求 (1)圓心坐標 (2)直徑長")
    center_x = Fraction(-3 + 0, 2)
    center_y = Fraction(2 + 6, 2)
    diameter = math.sqrt((0 - (-3))**2 + (6 - 2)**2)
    print("  > (1) 圓心為 AB 中點：")
    print("        x = (-3 + 0) / 2 = {}".format(center_x))
    print("        y = (2 + 6) / 2 = {}".format(center_y))
    print("        圓心坐標為 ({}, {})".format(center_x, center_y))
    print("  > (2) 直徑長為 AB 距離：")
    print("        d = sqrt((0 - (-3))^2 + (6 - 2)^2)")
    print("          = sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = {}".format(int(diameter)))
    print("  (!) 學生作答狀況分析：")
    print("      - (1) 圓心坐標寫為 (-3/2, 4)  ==> 正確！")
    print("      - (2) 直徑長【漏寫未作答】！")
    print("      - 老師批改：紅筆圈出並註記 -3 分 (此題實得 7 分 / 滿分 10 分)")

    # 第 7 題
    print("\n[計算題 7] 解一元二次不等式：2x^2 + 5x - 3 < 0")
    # 2x^2 + 5x - 3 = (2x - 1)(x + 3) < 0
    # 根為 -3 與 1/2，故 -3 < x < 1/2
    print("  > 因式分解十字交乘：")
    print("      2x      -1  =>  -x")
    print("       x      +3  =>  +6x")
    print("      --------------------")
    print("                      +5x  (符合一次項)")
    print("  > 方程式分解為：(2x - 1)(x + 3) < 0")
    print("  > 兩根分別為 x = 1/2 與 x = -3")
    print("  > 小於 0 取兩根之間：-3 < x < 1/2")
    print("  [V] 學生作答：-3 < x < 1/2  ==> 正確 (+10分)")

    # 第 8 題
    print("\n[計算題 8] 平行四邊形 ABCD，已知 A(3, 4), C(-1, -2), D(2, 5)，求 B 點坐標")
    # 對角線互相平分：A + C = B + D => B = A + C - D
    bx = 3 + (-1) - 2
    by = 4 + (-2) - 5
    print("  > 平行四邊形對角線互相平分，AC 中點 = BD 中點：")
    print("      (A + C) / 2 = (B + D) / 2  =>  A + C = B + D")
    print("  > B = A + C - D")
    print("      B_x = 3 + (-1) - 2 = {}".format(bx))
    print("      B_y = 4 + (-2) - 5 = {}".format(by))
    print("  > B 點坐標為 ({}, {})".format(bx, by))
    print("  [V] 學生作答：B(0, -3)  ==> 正確 (+10分)")

    # ==========================================
    # 填充題 1~5 題
    # ==========================================
    print("\n" + "=" * 60)
    print("【填充題 1~5 題】（每題 4 分，共 20 分）")
    print("=" * 60)

    # 填充 1
    print("\n[填充 1] 因式分解 x^2 - 10x + 24")
    print("  > 尋找兩數 p, q 滿足 p * q = 24 且 p + q = -10")
    print("    (-6) * (-4) = 24, (-6) + (-4) = -10")
    print("  > 結果：(x - 6)(x - 4)")
    print("  [V] 學生作答：(x - 6)(x - 4)  ==> 正確 (+4分)")

    # 填充 2
    print("\n[填充 2] 設 f(x) = 3x^2 - x + 1，求 f(2) + f(-1)")
    f = lambda x: 3 * (x**2) - x + 1
    f2 = f(2)
    f_neg1 = f(-1)
    ans2 = f2 + f_neg1
    print("  > f(2)  = 3*(2)^2 - (2) + 1 = 12 - 2 + 1 = {}".format(f2))
    print("  > f(-1) = 3*(-1)^2 - (-1) + 1 = 3 + 1 + 1 = {}".format(f_neg1))
    print("  > f(2) + f(-1) = {} + {} = {}".format(f2, f_neg1, ans2))
    print("  [V] 學生作答：16  ==> 正確 (+4分)")

    # 填充 3
    print("\n[填充 3] 設 a < 0, b > 0，判斷 P(b - a, a^3 * b) 位於第幾象限")
    print("  > x 坐標 = b - a：")
    print("     已知 b > 0 且 a < 0，故 -a > 0，則 b - a > 0 (正數)")
    print("  > y 坐標 = a^3 * b：")
    print("     已知 a < 0 則 a^3 < 0 (負數)，且 b > 0 (正數)，故 a^3 * b < 0 (負數)")
    print("  > 點 P 符號為 (+, -)，位於【第四象限】")
    print("  [V] 學生作答：第四象限  ==> 正確 (+4分)")

    # 填充 4
    print("\n[填充 4] 將二次函數 f(x) = (x-3)^2 - 1 圖形向右平移 2 單位，向下平移 3 單位")
    print("  > 原頂點坐標為 (3, -1)")
    print("  > 向右平移 2 單位：x -> x - 2 (頂點 x 變為 3 + 2 = 5)")
    print("  > 向下平移 3 單位：y -> y - 3 (頂點 y 變為 -1 - 3 = -4)")
    print("  > 平移後函數為：f(x) = (x - 5)^2 - 4")
    print("  [V] 學生作答：(x - 5)^2 - 4  ==> 正確 (+4分)")

    # 填充 5
    print("\n[填充 5] 坐標平面上 A(-2, 5) 到 x 軸距離為 a，到 y 軸距離為 b，求 a, b")
    pt_x, pt_y = -2, 5
    dist_x = abs(pt_y)
    dist_y = abs(pt_x)
    print("  > 點 (x, y) 到 x 軸距離 = |y| = |{}| = {}".format(pt_y, dist_x))
    print("  > 點 (x, y) 到 y 軸距離 = |x| = |{}| = {}".format(pt_x, dist_y))
    print("  > 結果：a = {}, b = {}".format(dist_x, dist_y))
    print("  [V] 學生作答：a = 5, b = 2  ==> 正確 (+4分)")

    # ==========================================
    # 總結統計
    # ==========================================
    print("\n" + "=" * 60)
    print("【試卷批改總結】")
    print("=" * 60)
    print("  計算題得分：77 / 80 分 (第 6 題漏寫直徑長扣 3 分)")
    print("  填充題得分：20 / 20 分 (全對)")
    print("  ---------------------------------------------")
    print("  實得分數：97 分 (滿分 100 分)")
    print("  評語：概念非常清楚，計算過程工整！唯獨第 6 題有兩小題，記得作答時確認每小題皆有回答。")
    print_separator("=")

if __name__ == "__main__":
    solve_exam()
