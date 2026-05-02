// app.jsx — design canvas + tweaks

const PostIt = window.DCPostIt;

function App() {
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "density": "comfy"
  }/*EDITMODE-END*/);

  const d = tweaks.density;
  const W = 390, H = 844;

  return (
    <>
      <DesignCanvas>
        <DCSection id="flow" title="Lumi · AI weight-loss companion"
          subtitle="10 screens · cosmic dark · for Marco's 17 kg journey">

          <DCArtboard id="onboarding" label="01 · Onboarding" width={W} height={H}>
            <Onboarding density={d}/>
          </DCArtboard>

          <DCArtboard id="home" label="02 · Today / Home" width={W} height={H}>
            <Home density={d}/>
          </DCArtboard>

          <DCArtboard id="plan" label="03 · Daily meal plan" width={W} height={H}>
            <Plan density={d}/>
          </DCArtboard>

          <DCArtboard id="recipe" label="04 · Recipe detail" width={W} height={H}>
            <Recipe density={d}/>
          </DCArtboard>

          <DCArtboard id="tracker" label="05 · Calorie tracker (voice)" width={W} height={H}>
            <Tracker density={d}/>
          </DCArtboard>

          <DCArtboard id="weighin" label="06 · Sunday weigh-in + AI adjust" width={W} height={H}>
            <WeighIn density={d}/>
          </DCArtboard>

          <DCArtboard id="forecast" label="07 · Forecast / progress" width={W} height={H}>
            <Forecast density={d}/>
          </DCArtboard>

          <DCArtboard id="chat" label="08 · Lumi chat coach" width={W} height={H}>
            <Chat density={d}/>
          </DCArtboard>

          <DCArtboard id="shopping" label="09 · Shopping list" width={W} height={H}>
            <Shopping density={d}/>
          </DCArtboard>

          <DCArtboard id="profile" label="10 · Profile" width={W} height={H}>
            <Profile density={d}/>
          </DCArtboard>

          <PostIt top={-72} left={420} rotate={-3} width={220}>
            Each screen is a real interactive React component — drag, focus (↗), or open Tweaks (top-right toolbar) to switch density.
          </PostIt>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Information density">
          <TweakRadio
            value={tweaks.density}
            onChange={(v) => setTweak('density', v)}
            options={[
              { value: 'comfy',   label: 'Comfy' },
              { value: 'compact', label: 'Compact' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
