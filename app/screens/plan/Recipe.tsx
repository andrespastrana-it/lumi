'use client';

import { Blob, S, Em } from '@/app/components/ui';
import { Icon } from '@/app/lib/icons';
import { C, PILLOW_SHADOW, PILLOW_SHADOW_SM } from '@/app/lib/tokens';

const INGREDIENTS = ['180g chicken breast','60g quinoa','½ cucumber','¼ red onion','1 tbsp olive oil','Lemon, salt, pepper'];
const STEPS = ['Cook quinoa per package.','Season chicken, sear 4 min/side.','Slice veg, dress with oil + lemon.','Plate quinoa, top with chicken & veg.'];

export default function Recipe({ go }: { go: (r: string) => void }) {
  return (
    <div style={{ ...S.page, paddingBottom: 110 }}>
      <div style={{ position: 'relative', height: 280, background: `radial-gradient(circle at 60% 50%, #F4B690 0%, ${C.apricot} 50%, #B85530 100%)`, overflow: 'hidden' }}>
        <Blob color="#FBE0CC" size={240} top={20} left={30} opacity={0.08} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 200, height: 200, borderRadius: 999, background: 'radial-gradient(circle at 35% 35%, #FFF5E0, #F2E0BB 50%, #C5A268 90%)', boxShadow: '0 24px 48px -16px rgba(0,0,0,.35), inset 0 -12px 24px rgba(0,0,0,.12), inset 0 8px 16px rgba(255,255,255,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 110, height: 110, borderRadius: 999, background: 'radial-gradient(circle at 35% 35%, #E2EBE5, #7FA088 60%, #3D5A4A)', boxShadow: 'inset 0 -8px 16px rgba(0,0,0,.18), inset 0 4px 8px rgba(255,255,255,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="dinner" color="#fff" size={44} />
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 18, left: 22 }}>
          <button onClick={() => go('plan')} style={{ background: 'rgba(255,255,255,.25)', backdropFilter: 'blur(8px)', border: 0, width: 38, height: 38, borderRadius: 999, fontSize: 18, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif' }}>‹</button>
        </div>
        <div style={{ position: 'absolute', top: 18, right: 22 }}>
          <button style={{ background: 'rgba(255,255,255,.25)', backdropFilter: 'blur(8px)', border: 0, width: 38, height: 38, borderRadius: 999, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="heart" color="#fff" size={18} />
          </button>
        </div>
      </div>

      <div style={{ padding: '0 22px', marginTop: -32, position: 'relative', zIndex: 2 }}>
        <div style={{ ...S.pillow, padding: 22 }}>
          <h1 style={{ ...S.h1, fontSize: 32 }}>Chicken &amp;<br /><Em>quinoa</Em> bowl</h1>
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            {[
              { icon: 'sleep', label: '12 min', tone: C.apricotLt },
              { icon: 'flame', label: '520 kcal', tone: C.butterLt },
              { icon: 'sparkle', label: 'P 38', tone: C.greenLt },
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, padding: '10px 8px', borderRadius: 14, background: item.tone, textAlign: 'center' }}>
                <div style={{ width: 18, height: 18, margin: '0 auto' }}><Icon name={item.icon} color={C.apricotDk} size={18} /></div>
                <div style={{ fontSize: 11, fontFamily: '"Fraunces",serif', color: C.ink, marginTop: 4 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ ...S.pad, marginTop: 24 }}>
        <div style={S.eyebrow}>Ingredients</div>
        <div style={{ marginTop: 10, ...S.pillow, padding: 0 }}>
          {INGREDIENTS.map((x, i) => (
            <div key={x} style={{ padding: '12px 18px', borderBottom: i < INGREDIENTS.length - 1 ? `1px solid ${C.hair}` : 0, fontSize: 14, color: C.ink, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: 999, background: C.apricot }} />
              {x}
            </div>
          ))}
        </div>
        <div style={{ ...S.eyebrow, marginTop: 24 }}>Method</div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ ...S.pillowSm, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 999, background: C.apricot, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Fraunces",serif', fontSize: 15, fontWeight: 500, boxShadow: PILLOW_SHADOW_SM, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1, fontSize: 14, color: C.ink, lineHeight: 1.5, paddingTop: 6 }}>{step}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '28px 22px 22px' }}>
        <button style={S.ctaApricot} onClick={() => go('shopping')}>Add to shopping list</button>
        <button style={S.ctaLine} onClick={() => go('logChoose')}>I made this — log it</button>
      </div>
    </div>
  );
}
