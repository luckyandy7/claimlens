from playwright.sync_api import sync_playwright,expect
import json
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,channel='chrome');ctx=b.new_context(viewport={'width':1440,'height':1000},reduced_motion='no-preference');page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:3000');page.wait_for_load_state('networkidle');expect(page.locator('html')).to_have_attribute('data-motion','on')
 page.locator('#evidence').scroll_into_view_if_needed();page.wait_for_timeout(1200);expect(page.locator('.cl-evidence-number strong')).to_have_text('61%')
 page.get_by_role('button',name='화면 모션 끄기').click();expect(page.locator('html')).to_have_attribute('data-motion','off');assert page.evaluate('document.getAnimations().filter(a=>a.playState==="running").length')==0
 page.reload();expect(page.locator('html')).to_have_attribute('data-motion','off');page.get_by_role('button',name='화면 모션 켜기').click()
 page.get_by_role('button',name='직접 경험하기').click();page.wait_for_url('**/app/claims');page.wait_for_load_state('networkidle');page.wait_for_timeout(1000)
 claims=ctx.request.get('http://127.0.0.1:3000/api/claims').json();done=sum(c['status']=='resolved' for c in claims);percent=round(done/len(claims)*100) if claims else 0
 expect(page.locator('.workspace-summary strong')).to_contain_text(str(percent)+'%');page.screenshot(path='artifacts/workspace-redesign-desktop.png',full_page=True)
 page.get_by_role('link',name='새 접수',exact=True).last.click();page.wait_for_url('**/new');expect(page.locator('.side-link[aria-current=page]')).to_contain_text('새 접수');page.screenshot(path='artifacts/new-claim-redesign.png',full_page=True)
 for w in [360,390,768,1280,1440]:
  page.set_viewport_size({'width':w,'height':900});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),w
 page.get_by_role('link',name='접수함으로').click();page.wait_for_load_state('networkidle');page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(1000);page.screenshot(path='artifacts/workspace-redesign-mobile.png',full_page=True)
 page.emulate_media(reduced_motion='reduce');expect(page.locator('html')).to_have_attribute('data-motion','off');assert page.evaluate('document.getAnimations().filter(a=>a.playState==="running").length')==0
 assert not errors
 result={'counter_final':'61%','pause':'passed','pause_persistence':'passed','navigation':'passed','active_navigation':'passed','workspace_percentage':percent,'reduced_motion':'passed','new_form_widths':[360,390,768,1280,1440],'errors':errors};open('artifacts/motion-checks.json','w').write(json.dumps(result,indent=2));print(json.dumps(result));ctx.close();b.close()
