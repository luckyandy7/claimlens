from playwright.sync_api import sync_playwright,expect
import json
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,channel='chrome');c=b.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce');page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto('http://127.0.0.1:3000');page.locator('#process').scroll_into_view_if_needed();tabs=page.get_by_role('tab');tabs.nth(0).focus();page.keyboard.press('ArrowDown');expect(tabs.nth(1)).to_be_focused();expect(page.locator('.cl-preview-shots li')).to_have_count(3);page.screenshot(path='artifacts/ranking-preview-request.png');page.keyboard.press('ArrowDown');expect(page.locator('.cl-preview-review')).to_contain_text('AI 판정 기능은 연결되어 있지 않습니다.');page.screenshot(path='artifacts/ranking-preview-review.png')
 for width in [320,390,768,1024,1440]:
  page.set_viewport_size({'width':width,'height':900})
  for i in range(3):
   tabs.nth(i).click();assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),(width,i)
 page.get_by_role('button',name='직접 경험하기').click();page.wait_for_url('**/app/claims')
 page.route('**/api/claims',lambda r:(page.wait_for_timeout(900),r.continue_()));page.reload();expect(page.locator('.records-loading')).to_have_attribute('aria-busy','true');expect(page.locator('.records-loading')).not_to_be_visible();assert not errors,errors;c.close()
 c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=1,reduced_motion='reduce');page=c.new_page();page.goto('http://127.0.0.1:3000');page.wait_for_load_state('networkidle');src=page.locator('.cl-scene-photo').evaluate('(e)=>e.currentSrc');assert 'small.webp' in src,src;page.locator('#process').scroll_into_view_if_needed();page.get_by_role('tab').nth(1).click();page.screenshot(path='artifacts/ranking-preview-mobile.png');print(json.dumps({'viewports':[320,390,768,1024,1440],'keyboard_tabs':'passed','three_distinct_stages':'passed','loading_state':'passed','mobile_image':src,'errors':errors}));b.close()
