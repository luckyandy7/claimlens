from playwright.sync_api import sync_playwright, expect
from pathlib import Path
import json,re
BASE='http://127.0.0.1:3000'
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,channel='chrome')
 context=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto(BASE);page.wait_for_load_state('networkidle')
 page.screenshot(path='artifacts/landing-desktop.png',full_page=True)
 page.get_by_role('button',name='직접 경험하기').click();page.wait_for_url('**/app/claims');page.wait_for_load_state('networkidle')
 expect(page.get_by_text('에센셜 헤드폰 · 스톤',exact=True)).to_be_visible()
 page.screenshot(path='artifacts/workspace-desktop.png',full_page=True)
 page.get_by_role('link',name='새 접수',exact=True).last.click()
 page.get_by_label('주문번호',exact=True).fill('TEST-1108')
 page.get_by_label('고객명',exact=True).fill('테스트 고객')
 page.get_by_label('상품명',exact=True).fill('테스트 헤드폰')
 page.get_by_label('접수 사유',exact=True).fill('제품 상태 확인 요청')
 page.get_by_role('button',name='접수 만들기',exact=True).click();page.wait_for_url(re.compile(r'/app/claims/[0-9a-f-]{36}$'));page.wait_for_load_state('networkidle')
 claim_url=page.url;cid=claim_url.split('/')[-1]
 page.locator('input[type=file]').set_input_files('artifacts/test-product.png')
 expect(page.get_by_text('출고 사진이 등록되었습니다.',exact=True)).to_be_visible()
 page.get_by_role('button',name='제출 링크 발급').click()
 link=page.get_by_label('고객 제출 링크');expect(link).to_be_visible();capture_url=link.input_value()
 customer=browser.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')
 cp=customer.new_page();cp.goto(capture_url);cp.wait_for_load_state('networkidle')
 cp.screenshot(path='artifacts/capture-mobile.png',full_page=True)
 for i in range(3):
  cp.get_by_label('사진 선택',exact=True).set_input_files('artifacts/test-product.png')
  if i<2:cp.get_by_role('button',name='다음 사진').click()
 cp.get_by_role('button',name='사진 3장 제출하기').click();expect(cp.get_by_role('heading',name='자료가 전달되었습니다.')).to_be_visible()
 page.reload();page.wait_for_load_state('networkidle');expect(page.get_by_text('고객이 사진 3장을 제출했습니다.',exact=True)).to_be_visible()
 page.screenshot(path='artifacts/detail-desktop.png',full_page=True)
 page.get_by_role('button',name='출고 사진 확대').click();expect(page.get_by_role('dialog')).to_be_visible();page.keyboard.press('Escape');expect(page.get_by_role('dialog')).not_to_be_visible()
 page.get_by_label('처리 사유',exact=True).fill('사진 확인 후 고객에게 안내했습니다.')
 page.get_by_role('button',name='검토 완료',exact=True).click();expect(page.get_by_text('검토를 완료했습니다.',exact=True)).to_be_visible()
 page.reload();expect(page.get_by_text('검토를 완료했습니다.',exact=True)).to_be_visible()
 # Cross-workspace access is denied, including binary assets.
 outsider=browser.new_context();assert outsider.request.post(BASE+'/api/demo').ok
 assert outsider.request.get(BASE+'/api/claims/'+cid).status==404
 claim=context.request.get(BASE+'/api/claims/'+cid).json()
 asset_url=next(a['url'] for a in claim['assets'] if a['side']=='outgoing')
 assert outsider.request.get(BASE+asset_url).status==404
 assert customer.request.get(BASE+'/api/claims/'+cid).status==401
 assert context.request.post(BASE+'/api/demo',headers={'Origin':'https://example.com'}).status==403
 assert customer.request.get(BASE+'/api/capture/invalid').status==404
 # Used token refuses repeat upload.
 assert customer.request.post(capture_url.replace('/capture/','/api/capture/'),multipart={}).status==409
 for width in [390,768,1280]:
  page.set_viewport_size({'width':width,'height':900});page.goto(BASE);page.wait_for_load_state('networkidle')
  assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), f'landing overflow {width}'
  if width==390:page.screenshot(path='artifacts/landing-mobile.png',full_page=True)
  page.goto(BASE+'/app/claims');page.wait_for_load_state('networkidle')
  assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'),f'workspace overflow {width}'
  if width==390:page.screenshot(path='artifacts/workspace-mobile.png',full_page=True)
 assert not errors,errors
 print(json.dumps({'core_flow':'passed','persistence':'passed','workspace_isolation':'passed','private_assets':'passed','invalid_and_used_link':'passed','cross_origin':'passed','responsive':[390,768,1280,1440],'browser_errors':errors}))
 browser.close()
