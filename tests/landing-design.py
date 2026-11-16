from playwright.sync_api import sync_playwright,expect
import json
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,channel='chrome'); page=b.new_page(viewport={'width':1440,'height':1000}); errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:3000');page.wait_for_load_state('networkidle')
 for name in ['고객의 사진','담당자의 검토','출고 기록']:
  t=page.get_by_role('tab',name=name);t.click();expect(t).to_have_attribute('aria-selected','true')
 page.get_by_role('tab',name='출고 기록').focus();page.keyboard.press('ArrowDown');expect(page.get_by_role('tab',name='고객의 사진')).to_be_focused()
 page.get_by_role('button',name='AI가 반품 승인 여부를 결정하나요?').click();expect(page.get_by_text('현재 데모는 사진 수집',exact=False)).to_be_visible()
 results=[]
 for w in [360,390,768,1280,1440]:
  page.set_viewport_size({'width':w,'height':900});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),w
  assert page.locator('img').evaluate_all('(imgs)=>imgs.every(i=>i.complete&&i.naturalWidth>0)')
  results.append(w)
 page.emulate_media(reduced_motion='reduce');assert page.locator('.cl-intro-heading').evaluate('(e)=>getComputedStyle(e).animationName')=='none'
 page.set_viewport_size({'width':1440,'height':1000});page.goto('http://127.0.0.1:3000');page.wait_for_load_state('networkidle');page.screenshot(path='artifacts/redesign-desktop.png',full_page=True)
 page.set_viewport_size({'width':390,'height':844});page.screenshot(path='artifacts/redesign-mobile.png',full_page=True)
 print(json.dumps({'tabs':'pass','keyboard':'pass','faq':'pass','images':'loaded','no_overflow':results,'reduced_motion':'pass','page_errors':errors}))
 assert not errors;b.close()
