from playwright.sync_api import sync_playwright,expect
import json
BASE='http://127.0.0.1:3000'
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,channel='chrome');c=b.new_context(viewport={'width':1440,'height':1000},reduced_motion='no-preference',permissions=['clipboard-read','clipboard-write']);page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script('''window.sceneCount=0; if(document.startViewTransition){const original=document.startViewTransition.bind(document);document.startViewTransition=(...args)=>{window.sceneCount++;return original(...args)}}''')
 page.goto(BASE);page.get_by_role('button',name='직접 경험하기').click();page.wait_for_url('**/app/claims');page.wait_for_timeout(700)
 assert page.evaluate('window.sceneCount')>=1
 marker=page.locator('.selection-marker');before=marker.evaluate('(e)=>e.style.transform');page.locator('.tabs button').nth(1).click();page.wait_for_timeout(300);assert marker.evaluate('(e)=>e.style.transform')!=before
 page.locator('.tabs button').first.click();page.locator('.product-link').first.click();page.wait_for_timeout(750)
 trigger=page.get_by_role('button',name='출고 상태 · 예시 이미지 확대');expect(trigger).to_be_visible();trigger.click();dialog=page.get_by_role('dialog');expect(dialog).to_be_visible();page.wait_for_timeout(300);assert dialog.locator('img').bounding_box()['width']>300;page.screenshot(path='artifacts/interaction-modal.png')
 page.keyboard.press('Escape');expect(dialog).to_have_attribute('data-closing','true');expect(dialog).not_to_be_visible();expect(trigger).to_be_focused()
 trigger.click();page.wait_for_timeout(270);page.get_by_role('button',name='확대 닫기').click();page.emulate_media(reduced_motion='reduce');expect(dialog).not_to_be_visible();expect(trigger).to_be_focused();page.emulate_media(reduced_motion='no-preference')
 page.route('**/api/claims/*',lambda route:(page.wait_for_timeout(450),route.continue_()) if route.request.method=='POST' else route.continue_())
 page.get_by_role('button',name='제출 링크 발급').click();expect(page.get_by_role('button',name='자료 요청 준비 중…')).to_have_attribute('aria-busy','true');expect(page.get_by_label('고객 제출 링크')).to_be_visible();page.get_by_role('button',name='링크 복사',exact=True).click();expect(page.get_by_role('button',name='복사 완료')).to_have_attribute('data-action-state','success')
 assert page.evaluate('navigator.clipboard.readText()')==page.get_by_label('고객 제출 링크').input_value()
 page.get_by_role('link',name='접수함으로').click();page.wait_for_url('**/app/claims');page.wait_for_timeout(700)
 page.get_by_role('link',name='새 접수',exact=True).last.click();page.wait_for_url('**/new');page.wait_for_timeout(600);assert page.evaluate('window.sceneCount')>=4
 page.emulate_media(reduced_motion='reduce');count=page.evaluate('window.sceneCount');page.get_by_role('link',name='접수함으로').click();page.wait_for_url('**/app/claims');assert page.evaluate('window.sceneCount')==count
 assert not errors,errors
 result={'view_transitions':count,'filter_marker':'passed','modal_exit_and_focus':'passed','pause_during_exit':'passed','busy_state':'passed','clipboard_success':'passed','reduced_motion_fallback':'passed','browser_errors':errors};open('artifacts/interaction-checks.json','w').write(json.dumps(result,indent=2));print(json.dumps(result));b.close()
