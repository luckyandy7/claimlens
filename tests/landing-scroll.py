from playwright.sync_api import sync_playwright,expect
import json
BASE='http://127.0.0.1:3000'
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,channel='chrome');c=b.new_context(viewport={'width':1440,'height':900},reduced_motion='no-preference');page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE);expect(page.locator('.cl-page')).to_have_attribute('data-scroll-motion','ready');page.wait_for_timeout(300)
 target=page.locator('.cl-context h2');expect(target).to_have_attribute('data-scroll-state','waiting');assert float(target.evaluate('(e)=>getComputedStyle(e).opacity'))==0
 before=page.locator('.cl-scene-photo').evaluate('(e)=>getComputedStyle(e).transform')
 page.evaluate("window.scrollTo({top:document.querySelector('.cl-context h2').getBoundingClientRect().top+scrollY-innerHeight*.65,behavior:'instant'})")
 page.wait_for_timeout(180);middle=float(target.evaluate('(e)=>getComputedStyle(e).opacity'));assert 0<middle<1,middle
 page.screenshot(path='artifacts/scroll-mid-reveal.png');page.wait_for_timeout(1100);expect(target).to_have_attribute('data-scroll-state','shown');assert float(target.evaluate('(e)=>getComputedStyle(e).opacity'))==1
 after=page.locator('.cl-scene-photo').evaluate('(e)=>getComputedStyle(e).transform');assert before!=after
 page.screenshot(path='artifacts/scroll-context-complete.png')
 for selector in ['#evidence','#process','.cl-principle','#value','.cl-business','#questions','.cl-end']:
  page.locator(selector).scroll_into_view_if_needed();page.wait_for_timeout(1100)
  visible=page.locator(selector).evaluate('(el)=>[...el.querySelectorAll("[data-scroll-state]")].filter(e=>{let r=e.getBoundingClientRect();return r.top<innerHeight*.88&&r.bottom>0}).every(e=>getComputedStyle(e).opacity==="1")');assert visible,selector
 page.screenshot(path='artifacts/scroll-end.png')
 # Pause restores every still-hidden item; enabling does not replay already-read content.
 page.goto(BASE);expect(page.locator('.cl-page')).to_have_attribute('data-scroll-motion','ready');page.get_by_role('button',name='화면 모션 끄기').click();assert page.locator('[data-scroll-state="waiting"]').count()==0
 assert page.locator('.cl-context h2').evaluate('(e)=>getComputedStyle(e).opacity')=='1'
 page.get_by_role('button',name='화면 모션 켜기').click();expect(page.locator('.cl-page')).to_have_attribute('data-scroll-motion','ready')
 page.emulate_media(reduced_motion='reduce');expect(page.locator('html')).to_have_attribute('data-motion','off');assert page.locator('[data-scroll-state="waiting"]').count()==0
 page.emulate_media(reduced_motion='no-preference');page.set_viewport_size({'width':390,'height':844});page.goto(BASE);expect(page.locator('.cl-page')).to_have_attribute('data-scroll-motion','ready');page.locator('#process').scroll_into_view_if_needed();page.wait_for_timeout(1100);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');page.screenshot(path='artifacts/scroll-mobile.png')
 # SPA return creates a fresh scoped scene, with no detached-node errors.
 page.get_by_role('button',name='직접 경험하기').click();page.wait_for_url('**/app/claims');page.get_by_role('link',name='ClaimLens 홈').click();page.wait_for_url(BASE+'/');expect(page.locator('.cl-page')).to_have_attribute('data-scroll-motion','ready')
 assert not errors,errors
 result={'mid_reveal_opacity':middle,'sections':7,'parallax':'passed','pause_restores_content':'passed','reduced_motion':'passed','mobile':'passed','route_cleanup':'passed','errors':errors};open('artifacts/landing-scroll-checks.json','w').write(json.dumps(result,indent=2));print(json.dumps(result));b.close()
