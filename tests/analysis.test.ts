import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeClaim, parseAnalysis } from '../src/lib/analysis';
import type { Claim } from '../src/lib/domain';
test('rejects malformed model content',()=>{
 assert.throws(()=>parseAnalysis('{"summary":"ok","observations":[42]}'));
});
test('vision request uses server key, image labels, schema and no remote persistence',async()=>{
 const original=globalThis.fetch; const previous=process.env.OPENAI_API_KEY;
 process.env.OPENAI_API_KEY='test-only';
 const result={summary:'예시 그림 비교',observations:['동일 그림'],uncertainties:['실물 확인 불가'],additionalPhotos:['실제 사진']};
 globalThis.fetch=async (_url,init)=>{
  const body=JSON.parse(init!.body as string);
  assert.equal(body.store,false);assert.equal(body.text.format.strict,true);
  assert.equal(body.input[0].content.filter((x:{type:string})=>x.type==='input_image').length,2);
  assert.match(body.input[0].content[1].image_url,/^data:image\/jpeg;base64,/);
  return Response.json({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(result)}]}]});
 };
 try {
  const c={id:'test',assets:[{id:'sample-out',side:'outgoing',url:'/headphone.svg'},{id:'sample-in',side:'incoming',url:'/headphone.svg'}]} as Claim;
  const out=await analyzeClaim(c);assert.equal(out.summary,result.summary);assert.deepEqual(out.assetIds,['sample-out','sample-in']);
  delete process.env.OPENAI_API_KEY;await assert.rejects(()=>analyzeClaim(c),/OPENAI_API_KEY/);
 } finally {globalThis.fetch=original;if(previous===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=previous;}
});
