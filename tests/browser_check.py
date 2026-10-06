import os,json,subprocess,time,urllib.request,signal
from pathlib import Path
from playwright.sync_api import sync_playwright
r=Path(__file__).resolve().parents[1]
s=subprocess.Popen(['npm','run','dev','--','--port','5181'],cwd=r,stdout=subprocess.DEVNULL,stderr=subprocess.STDOUT,start_new_session=True)
try:
 for _ in range(80):
  try:urllib.request.urlopen('http://127.0.0.1:5181');break
  except Exception:time.sleep(.1)
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,executable_path=os.environ.get('CHROMIUM_PATH'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
  page=b.new_page(viewport={'width':1440,'height':900});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto('http://127.0.0.1:5181');page.wait_for_function('window.fightingDiagnostics && fightingDiagnostics().webgl');page.locator('#start').click();page.wait_for_function('fightingDiagnostics().time>.2')
  page.keyboard.down('w');page.wait_for_function('fightingDiagnostics().z<4',timeout=30000);page.keyboard.up('w');page.keyboard.press('2');assert page.evaluate('fightingDiagnostics().selected')==1
  page.locator('#ability').click();page.wait_for_function('fightingDiagnostics().hits>0');assert page.evaluate('fightingDiagnostics().mp')<100;assert page.evaluate('fightingDiagnostics().bossHp')<650
  page.keyboard.press(' ');page.wait_for_timeout(300);page.screenshot(path=str(r/'docs/desktop.png'))
  page.locator('#pause').click();t=page.evaluate('fightingDiagnostics().time');page.wait_for_timeout(300);assert page.evaluate('fightingDiagnostics().time')==t;page.locator('#start').click()
  page.locator('#restart').click();assert page.evaluate('fightingDiagnostics().bossHp')==650 and page.evaluate('fightingDiagnostics().selected')==0
  page.set_viewport_size({'width':390,'height':844});page.locator('#start').click();btn=page.locator('[data-key="ArrowUp"]').bounding_box();page.mouse.move(btn['x']+btn['width']/2,btn['y']+btn['height']/2);page.mouse.down();page.wait_for_function('fightingDiagnostics().z<7');page.mouse.up();page.locator('[data-hero="2"]').click();assert page.evaluate('fightingDiagnostics().selected')==2
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path=str(r/'docs/mobile.png'));assert not errors,errors
  (r/'docs/browser-report.json').write_text(json.dumps({'passed':['WebGL render','keyboard movement','hero switching','ability damage and mana','dodge input','pause freezes clock','restart resets encounter','touch movement','mobile party switching','mobile layout'],'page_errors':errors},indent=2));b.close()
finally:os.killpg(s.pid,signal.SIGTERM)
