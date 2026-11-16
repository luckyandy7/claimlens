from playwright.sync_api import sync_playwright, expect
import json
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,channel='chrome');page=b.new_page(viewport={'width':1440,'height':1000},reduced_motion='no-preference')
 page.add_init_script('''window.transitions=[]; if(document.startViewTransition){const start=document.startViewTransition.bind(document); document.startViewTransition=(...args)=>{const t=start(...args);t.ready.then(()=>window.transitions.push('ready'),e=>window.transitions.push(e.name));return t;};}''')
 page.goto('http://127.0.0.1:3000');page.get_by_role('button',name='직접 경험하기').click();page.wait_for_url('**/app/claims');page.wait_for_timeout(700)
 source=page.locator('.product-thumb').first.evaluate('(e)=>getComputedStyle(e).viewTransitionName')
 page.locator('.product-link').first.click();page.wait_for_url('**/app/claims/*');expect(page.locator('.detail-identity-photo')).to_be_visible();page.wait_for_timeout(500)
 assert page.locator('.detail-identity-photo').evaluate('(e)=>getComputedStyle(e).viewTransitionName')==source
 assert page.evaluate('window.transitions.every(x=>x==="ready")')
 page.screenshot(path='artifacts/motion-detail.png')
 trigger=page.get_by_role('button',name='출고 상태 · 예시 이미지 확대');trigger.click();photo=page.locator('dialog > img');expect(photo).to_be_visible();page.wait_for_timeout(65)
 animations=photo.evaluate('(e)=>e.getAnimations().map(a=>a.effect.getKeyframes())');assert animations,'No photo expansion animation'
 assert 'translate(' in animations[0][0]['transform'];page.screenshot(path='artifacts/motion-photo-expanding.png');page.wait_for_timeout(300);page.keyboard.press('Escape');expect(page.get_by_role('dialog')).not_to_be_visible();expect(trigger).to_be_focused()
 page.set_viewport_size({'width':390,'height':844});page.screenshot(path='artifacts/motion-detail-mobile.png');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 print(json.dumps({'shared_image_name':source,'transition_readiness':page.evaluate('window.transitions'),'photo_origin_transform':animations[0][0]['transform'],'mobile':'passed'}));b.close()
