from playwright.sync_api import sync_playwright,expect
import json
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,channel='chrome');page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:3000');page.wait_for_load_state('networkidle')
 expect(page.get_by_test_id('value-hours')).to_have_text('10시간');expect(page.get_by_test_id('value-money')).to_have_text('300,000원');expect(page.get_by_test_id('value-net')).to_have_text('1,000원')
 slider=page.locator('#value-minutes');slider.focus();page.keyboard.press('Home');expect(page.get_by_test_id('value-net')).to_have_text('-299,000원')
 for _ in range(6):page.keyboard.press('ArrowRight')
 expect(page.get_by_test_id('value-hours')).to_have_text('30시간');expect(page.get_by_test_id('value-net')).to_have_text('601,000원')
 page.locator('#value-cases').focus();page.keyboard.press('Home');expect(page.get_by_test_id('value-money')).to_have_text('0원')
 for text in ['관련 논문은 무엇을 말하나요?','계산식과 실제 검증 방법','요금과 사업성의 근거는 무엇인가요?']:
  page.get_by_text(text,exact=True).click()
 expect(page.get_by_role('link',name='QJE',exact=False)).to_be_visible()
 links=page.locator('#evidence a, #business a').evaluate_all('(a)=>a.map(x=>x.href)');assert len(links)==4 and all(u.startswith('https://') for u in links)
 for width in [360,390,768,1280,1440]:
  page.set_viewport_size({'width':width,'height':900});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
 page.reload();page.wait_for_load_state('networkidle');page.locator('#value-title').click()
 page.locator('#evidence').screenshot(path='artifacts/evidence-desktop.png');page.locator('#value').screenshot(path='artifacts/value-desktop.png');page.locator('#business').screenshot(path='artifacts/business-desktop.png')
 page.set_viewport_size({'width':390,'height':844});page.locator('#evidence').screenshot(path='artifacts/evidence-mobile.png');page.locator('#value').screenshot(path='artifacts/value-mobile.png')
 assert not errors
 result={'calculator_default':'passed','zero_and_negative':'passed','six_minutes':'passed','zero_cases':'passed','disclosures':'passed','source_links':links,'viewports':[360,390,768,1280,1440],'browser_errors':errors}
 open('artifacts/evidence-checks.json','w').write(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps(result,ensure_ascii=False));b.close()
