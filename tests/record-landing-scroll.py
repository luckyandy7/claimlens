from playwright.sync_api import sync_playwright,expect
from pathlib import Path
BASE='http://127.0.0.1:3000'
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,channel='chrome');c=b.new_context(viewport={'width':1440,'height':900},reduced_motion='no-preference',record_video_dir='artifacts/scroll-video',record_video_size={'width':1440,'height':900});page=c.new_page();page.goto(BASE);expect(page.locator('.cl-page')).to_have_attribute('data-scroll-motion','ready');page.wait_for_timeout(1000)
 for selector in ['.cl-context','#evidence','#process','.cl-principle','#value','.cl-business','#questions','.cl-end']:
  page.locator(selector).evaluate('(e)=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-100,behavior:"smooth"})');page.wait_for_timeout(1700)
 video=page.video;c.close();video.save_as('artifacts/landing-scroll-demo.webm')
 c=b.new_context(viewport={'width':1440,'height':900});page=c.new_page();page.goto(BASE);expect(page.locator('.cl-page')).to_have_attribute('data-scroll-motion','ready');link=page.locator('.cl-context a');link.focus();expect(link).to_be_focused();assert link.evaluate('(e)=>getComputedStyle(e).opacity')=='1';print('Keyboard focus reveals hidden target: passed');c.close()
 c=b.new_context(java_script_enabled=False);page=c.new_page();page.goto(BASE);assert page.locator('.cl-context h2').evaluate('(e)=>getComputedStyle(e).opacity')=='1';print('No-JavaScript readable content: passed');b.close();print('Video: artifacts/landing-scroll-demo.webm')
