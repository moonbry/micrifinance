import { useState } from "react";
import axios from "axios";

function GroupLoan() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // SEHEMU 1: TAARIFA ZA MWOMBAJI
    jinaKamiliLaMwombaji: "",
    jinsia: "",
    jinaMaarufu: "",
    ainaYaKitambulisho: "",
    nambaYaKitambulisho: "",
    tareheYaKuzaliwa: "",
    simu: "",
    haliYaNdoa: "",
    eneoUnaioishi: "",
    umeishiHapoTanguLini: "",
    umilikiWaMakazi: "",
    jinaKamiliLaMumeMke: "",
    maarufuMtaani: "",
    tareheYaKuzaliwaMumeMke: "",
    idadiYaUtegemezi: "",
    simuYaMumeMke: "",

    // SEHEMU 2: TAARIFA ZA KIKUNDI
    jinaLaMwenyekiti: "",
    jinaLaKatibu: "",
    anuaniYaMakaziYaKikundi: "",
    nambaYaUsajiliWaKikundi: "",
    mkoa: "",
    wilaya: "",
    kata: "",
    kijijiMtaa: "",
    idadiYaWanachamaMe: "",
    idadiYaWanachamaKe: "",
    mudaKikundiKimekaaKatikaAnuaniHii: "",
    tareheYaUsajiri: "",
    simu1: "",
    simu2: "",

    // SEHEMU 3: TAARIFA ZA MIRADI
    jinaLaMradi: "",
    ainaYaMradi: "",
    mahaliMradiUpoKata: "",
    mahaliMradiUpoWilaya: "",
    wastaniWaKipatoKwaMwezi: "",
    wastaniWaMatumiziKwaMwezi: "",
    mradiUmeanzaLini: "",

    // SEHEMU 4: KIASI CHA MKOPO KINACHOOMBWA
    kiasiChaMkopo: "",
    mudaWaLipaMkopo: "",
    kiasiGaniChaRejeshoUnawezaKulipaBilaMatatizo: "",
    malengoYaMkopo: "",
    kiasiKikundiKinadaiwa: "",
    kikundiKimewahiKukopa: "",
    chanzoChaMapato: "",

    // SEHEMU 5: TAARIFA ZA MDHAMINI NO. 1 (MWENYEKITI WA KIKUNDI)
    mdhamini1JinaKamili: "",
    mdhamini1MahaliAnapoishi: "",
    mdhamini1NambaYaNyumba: "",
    mdhamini1AmepangaKwake: "",
    mdhamini1KaziAnayofanya: "",
    mdhamini1MahaliIlipoOfisi: "",
    mdhamini1JinaLaKampuniBiashara: "",
    mdhamini1Simu: "",

    // SEHEMU 6: TAARIFA ZA DHAMANA
    dhamanaAinaYaDhamana: "",
    dhamanaNambaYaUsajili: "",
    dhamanaThamaniYaDhamana: "",
    dhamanaThamaniYakeKwaSasa: "",
    dhamanaUmri: "",
    dhamanaMmilikiWamiliki: "",
    dhamanaRangiMuonekanoWaDhamana: "",
    dhamanaMahaliIlipo: "",

    // TAMKO
    tamkoLaMwombaji: false,
    tamkoLaMdhamini: false,
    tamkoLaMdhaminiWajibika: false,
    tamkoUhusiano: "",
  });

  const steps = [
    "SEHEMU 1: TAARIFA ZA MWOMBAJI",
    "SEHEMU 2: TAARIFA ZA KIKUNDI",
    "SEHEMU 3: TAARIFA ZA MIRADI",
    "SEHEMU 4: KIASI CHA MKOPO",
    "SEHEMU 5: MDHAMINI (MWENYEKITI)",
    "SEHEMU 6: TAARIFA ZA DHAMANA",
    "TAMKO NA WASILISHA"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.tamkoLaMwombaji || !form.tamkoLaMdhamini || !form.tamkoLaMdhaminiWajibika) {
      alert("Tafadhali kubali tamko zote za mwombaji na mdhamini");
      return;
    }

    if (!form.jinaKamiliLaMwombaji || !form.kiasiChaMkopo) {
      alert("Tafadhali jaza jina la mwombaji na kiasi cha mkopo");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/api/v1/loans", {
        name: form.jinaKamiliLaMwombaji,
        amount: form.kiasiChaMkopo,
        type: "group",
        details: {
          group: {
            chairman: form.jinaLaMwenyekiti,
            secretary: form.jinaLaKatibu,
            registrationNumber: form.nambaYaUsajiliWaKikundi,
            members: {
              male: form.idadiYaWanachamaMe,
              female: form.idadiYaWanachamaKe
            }
          },
          project: {
            name: form.jinaLaMradi,
            type: form.ainaYaMradi,
            monthlyIncome: form.wastaniWaKipatoKwaMwezi,
            monthlyExpenses: form.wastaniWaMatumiziKwaMwezi
          },
          collateral: {
            type: form.dhamanaAinaYaDhamana,
            registrationNumber: form.dhamanaNambaYaUsajili,
            value: form.dhamanaThamaniYakeKwaSasa
          },
          ...form
        },
      });

      console.log(res.data);
      alert("✅ OMBI LA MKOPO WA KIKUNDI LIMEWASILISHWA KWA MAFANIKIO!");

    } catch (error: any) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.message || "Imeshindwa kuwasilisha ombi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h1>📋 FOMU YA MAOMBI YA MKOPO WA KIKUNDI</h1>
        <p>Orethan Microfinance · Jaza taarifa zote kwa makini</p>

        {/* Step Indicators */}
        <div className="step-indicators">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`step-dot ${idx === currentStep ? "active" : ""} ${idx < currentStep ? "completed" : ""}`}
              onClick={() => idx < currentStep && setCurrentStep(idx)}
            >
              {idx + 1}
            </div>
          ))}
        </div>
        <div className="step-title">{steps[currentStep]}</div>

        <form onSubmit={handleSubmit}>
          <div className="form-scroll-container">
            {/* ========== SEHEMU 1: TAARIFA ZA MWOMBAJI ========== */}
            {currentStep === 0 && (
              <div className="form-grid-4cols">
                <div className="input-box"><input type="text" name="jinaKamiliLaMwombaji" placeholder=" " value={form.jinaKamiliLaMwombaji} onChange={handleChange} /><label>Jina kamili la mwombaji</label></div>
                <div className="input-box"><select name="jinsia" value={form.jinsia} onChange={handleChange}><option value="">Chagua</option><option>Me</option><option>Ke</option></select><label>Jinsia</label></div>
                <div className="input-box"><input type="text" name="jinaMaarufu" placeholder=" " value={form.jinaMaarufu} onChange={handleChange} /><label>Jina maarufu</label></div>
                <div className="input-box"><select name="ainaYaKitambulisho" value={form.ainaYaKitambulisho} onChange={handleChange}><option value="">Chagua</option><option>Kitambulisho cha Taifa</option><option>Pasipoti</option><option>Leseni</option></select><label>Aina ya Kitambulisho</label></div>
                <div className="input-box"><input type="text" name="nambaYaKitambulisho" placeholder=" " value={form.nambaYaKitambulisho} onChange={handleChange} /><label>Namba ya Kitambulisho</label></div>
                <div className="input-box"><input type="date" name="tareheYaKuzaliwa" placeholder=" " value={form.tareheYaKuzaliwa} onChange={handleChange} /><label>Tarehe ya kuzaliwa</label></div>
                <div className="input-box"><input type="tel" name="simu" placeholder=" " value={form.simu} onChange={handleChange} /><label>Simu</label></div>
                <div className="input-box"><select name="haliYaNdoa" value={form.haliYaNdoa} onChange={handleChange}><option value="">Chagua</option><option>Hajaoa/Olewa</option><option>Ameoa/Olewa</option><option>Ameachika</option><option>Mjane/Mgane</option></select><label>Hali ya Ndoa</label></div>
                <div className="input-box"><input type="text" name="eneoUnaioishi" placeholder=" " value={form.eneoUnaioishi} onChange={handleChange} /><label>Eneo unaioishi</label></div>
                <div className="input-box"><input type="text" name="umeishiHapoTanguLini" placeholder=" " value={form.umeishiHapoTanguLini} onChange={handleChange} /><label>Umeishi hapo tangu lini</label></div>
                <div className="input-box"><select name="umilikiWaMakazi" value={form.umilikiWaMakazi} onChange={handleChange}><option value="">Chagua</option><option>Kwako</option><option>Umepanga</option><option>Mengine (Eleza)</option></select><label>Umiliki wa Makazi</label></div>
                <div className="input-box"><input type="text" name="jinaKamiliLaMumeMke" placeholder=" " value={form.jinaKamiliLaMumeMke} onChange={handleChange} /><label>Jina kamili la mume/mke</label></div>
                <div className="input-box"><input type="text" name="maarufuMtaani" placeholder=" " value={form.maarufuMtaani} onChange={handleChange} /><label>Maarufu mtaani</label></div>
                <div className="input-box"><input type="date" name="tareheYaKuzaliwaMumeMke" placeholder=" " value={form.tareheYaKuzaliwaMumeMke} onChange={handleChange} /><label>Tarehe ya kuzaliwa (mume/mke)</label></div>
                <div className="input-box"><input type="number" name="idadiYaUtegemezi" placeholder=" " value={form.idadiYaUtegemezi} onChange={handleChange} /><label>Idadi ya utegemezi</label></div>
                <div className="input-box"><input type="tel" name="simuYaMumeMke" placeholder=" " value={form.simuYaMumeMke} onChange={handleChange} /><label>Simu ya mume/mke</label></div>
              </div>
            )}

            {/* ========== SEHEMU 2: TAARIFA ZA KIKUNDI ========== */}
            {currentStep === 1 && (
              <div className="form-grid-4cols">
                <div className="input-box"><input type="text" name="jinaLaMwenyekiti" placeholder=" " value={form.jinaLaMwenyekiti} onChange={handleChange} /><label>Jina la Mwenyekiti</label></div>
                <div className="input-box"><input type="text" name="jinaLaKatibu" placeholder=" " value={form.jinaLaKatibu} onChange={handleChange} /><label>Jina la Katibu</label></div>
                <div className="input-box"><input type="text" name="anuaniYaMakaziYaKikundi" placeholder=" " value={form.anuaniYaMakaziYaKikundi} onChange={handleChange} /><label>Anuani ya Makazi ya kikundi</label></div>
                <div className="input-box"><input type="text" name="nambaYaUsajiliWaKikundi" placeholder=" " value={form.nambaYaUsajiliWaKikundi} onChange={handleChange} /><label>Namba ya usajili wa kikundi</label></div>
                <div className="input-box"><input type="text" name="mkoa" placeholder=" " value={form.mkoa} onChange={handleChange} /><label>Mkoa</label></div>
                <div className="input-box"><input type="text" name="wilaya" placeholder=" " value={form.wilaya} onChange={handleChange} /><label>Wilaya</label></div>
                <div className="input-box"><input type="text" name="kata" placeholder=" " value={form.kata} onChange={handleChange} /><label>Kata</label></div>
                <div className="input-box"><input type="text" name="kijijiMtaa" placeholder=" " value={form.kijijiMtaa} onChange={handleChange} /><label>Kijiji/mtaa</label></div>
                <div className="input-box"><input type="number" name="idadiYaWanachamaMe" placeholder=" " value={form.idadiYaWanachamaMe} onChange={handleChange} /><label>Idadi ya wanachama (ME)</label></div>
                <div className="input-box"><input type="number" name="idadiYaWanachamaKe" placeholder=" " value={form.idadiYaWanachamaKe} onChange={handleChange} /><label>Idadi ya wanachama (KE)</label></div>
                <div className="input-box"><input type="text" name="mudaKikundiKimekaaKatikaAnuaniHii" placeholder=" " value={form.mudaKikundiKimekaaKatikaAnuaniHii} onChange={handleChange} /><label>Muda kikundi kimekaa katika Anuani hii</label></div>
                <div className="input-box"><input type="date" name="tareheYaUsajiri" placeholder=" " value={form.tareheYaUsajiri} onChange={handleChange} /><label>Tarehe ya usajiri</label></div>
                <div className="input-box"><input type="tel" name="simu1" placeholder=" " value={form.simu1} onChange={handleChange} /><label>Simu 1</label></div>
                <div className="input-box"><input type="tel" name="simu2" placeholder=" " value={form.simu2} onChange={handleChange} /><label>Simu 2</label></div>
              </div>
            )}

            {/* ========== SEHEMU 3: TAARIFA ZA MIRADI ========== */}
            {currentStep === 2 && (
              <div className="form-grid-4cols">
                <div className="input-box"><input type="text" name="jinaLaMradi" placeholder=" " value={form.jinaLaMradi} onChange={handleChange} /><label>Jina la Mradi</label></div>
                <div className="input-box"><input type="text" name="ainaYaMradi" placeholder=" " value={form.ainaYaMradi} onChange={handleChange} /><label>Aina ya Mradi</label></div>
                <div className="input-box"><input type="text" name="mahaliMradiUpoKata" placeholder=" " value={form.mahaliMradiUpoKata} onChange={handleChange} /><label>Mahali mradi upo (Kata)</label></div>
                <div className="input-box"><input type="text" name="mahaliMradiUpoWilaya" placeholder=" " value={form.mahaliMradiUpoWilaya} onChange={handleChange} /><label>Mahali mradi upo (Wilaya)</label></div>
                <div className="input-box"><input type="text" name="wastaniWaKipatoKwaMwezi" placeholder=" " value={form.wastaniWaKipatoKwaMwezi} onChange={handleChange} /><label>Wastani wa kipato kwa mwezi</label></div>
                <div className="input-box"><input type="text" name="wastaniWaMatumiziKwaMwezi" placeholder=" " value={form.wastaniWaMatumiziKwaMwezi} onChange={handleChange} /><label>Wastani wa matumizi kwa mwezi</label></div>
                <div className="input-box"><input type="text" name="mradiUmeanzaLini" placeholder=" " value={form.mradiUmeanzaLini} onChange={handleChange} /><label>Mradi umeanza lini</label></div>
              </div>
            )}

            {/* ========== SEHEMU 4: KIASI CHA MKOPO KINACHOOMBWA ========== */}
            {currentStep === 3 && (
              <div className="form-grid-4cols">
                <div className="input-box"><input type="text" name="kiasiChaMkopo" placeholder=" " value={form.kiasiChaMkopo} onChange={handleChange} /><label>Kiasi cha Mkopo</label></div>
                <div className="input-box"><input type="text" name="mudaWaLipaMkopo" placeholder=" " value={form.mudaWaLipaMkopo} onChange={handleChange} /><label>Muda wa kulipa Mkopo</label></div>
                <div className="input-box full-width"><input type="text" name="kiasiGaniChaRejeshoUnawezaKulipaBilaMatatizo" placeholder=" " value={form.kiasiGaniChaRejeshoUnawezaKulipaBilaMatatizo} onChange={handleChange} /><label>Ni kiasi gani cha rejesho unaweza kulipa bila matatizo?</label></div>
                <div className="input-box full-width"><textarea name="malengoYaMkopo" placeholder=" " rows={2} value={form.malengoYaMkopo} onChange={handleChange}></textarea><label>Malengo ya Mkopo</label></div>
                <div className="input-box"><input type="text" name="kiasiKikundiKinadaiwa" placeholder=" " value={form.kiasiKikundiKinadaiwa} onChange={handleChange} /><label>Kiasi kikundi kinadaiwa</label></div>
                <div className="input-box"><select name="kikundiKimewahiKukopa" value={form.kikundiKimewahiKukopa} onChange={handleChange}><option value="">Chagua</option><option>NDIYO</option><option>HAPANA</option></select><label>Kikundi kimewahi kukopa?</label></div>
                <div className="input-box"><input type="text" name="chanzoChaMapato" placeholder=" " value={form.chanzoChaMapato} onChange={handleChange} /><label>Chanzo cha mapato</label></div>
              </div>
            )}

            {/* ========== SEHEMU 5: TAARIFA ZA MDHAMINI NO. 1 (MWENYEKITI) ========== */}
            {currentStep === 4 && (
              <div className="form-grid-4cols">
                <div className="input-box"><input type="text" name="mdhamini1JinaKamili" placeholder=" " value={form.mdhamini1JinaKamili} onChange={handleChange} /><label>Jina kamili la Mwenyekiti</label></div>
                <div className="input-box"><input type="text" name="mdhamini1MahaliAnapoishi" placeholder=" " value={form.mdhamini1MahaliAnapoishi} onChange={handleChange} /><label>Mahali Anapoishi</label></div>
                <div className="input-box"><input type="text" name="mdhamini1NambaYaNyumba" placeholder=" " value={form.mdhamini1NambaYaNyumba} onChange={handleChange} /><label>Namba ya nyumba</label></div>
                <div className="input-box"><select name="mdhamini1AmepangaKwake" value={form.mdhamini1AmepangaKwake} onChange={handleChange}><option value="">Chagua</option><option>Amepanga</option><option>Kwake</option></select><label>Amepanga kwake</label></div>
                <div className="input-box"><input type="text" name="mdhamini1KaziAnayofanya" placeholder=" " value={form.mdhamini1KaziAnayofanya} onChange={handleChange} /><label>Kazi Anayofanya</label></div>
                <div className="input-box"><input type="text" name="mdhamini1MahaliIlipoOfisi" placeholder=" " value={form.mdhamini1MahaliIlipoOfisi} onChange={handleChange} /><label>Mahali ilipo Ofisi</label></div>
                <div className="input-box"><input type="text" name="mdhamini1JinaLaKampuniBiashara" placeholder=" " value={form.mdhamini1JinaLaKampuniBiashara} onChange={handleChange} /><label>Jina la kampuni/biashara</label></div>
                <div className="input-box"><input type="tel" name="mdhamini1Simu" placeholder=" " value={form.mdhamini1Simu} onChange={handleChange} /><label>Simu</label></div>
              </div>
            )}

            {/* ========== SEHEMU 6: TAARIFA ZA DHAMANA ========== */}
            {currentStep === 5 && (
              <div className="form-grid-4cols">
                <div className="input-box"><input type="text" name="dhamanaAinaYaDhamana" placeholder=" " value={form.dhamanaAinaYaDhamana} onChange={handleChange} /><label>Aina ya Dhamana</label></div>
                <div className="input-box"><input type="text" name="dhamanaNambaYaUsajili" placeholder=" " value={form.dhamanaNambaYaUsajili} onChange={handleChange} /><label>Namba ya usajili</label></div>
                <div className="input-box"><input type="text" name="dhamanaThamaniYaDhamana" placeholder=" " value={form.dhamanaThamaniYaDhamana} onChange={handleChange} /><label>Thamani ya dhamana</label></div>
                <div className="input-box"><input type="text" name="dhamanaThamaniYakeKwaSasa" placeholder=" " value={form.dhamanaThamaniYakeKwaSasa} onChange={handleChange} /><label>Thamani yake kwa sasa</label></div>
                <div className="input-box"><input type="text" name="dhamanaUmri" placeholder=" " value={form.dhamanaUmri} onChange={handleChange} /><label>Umri</label></div>
                <div className="input-box"><input type="text" name="dhamanaMmilikiWamiliki" placeholder=" " value={form.dhamanaMmilikiWamiliki} onChange={handleChange} /><label>Mmiliki/ wamiliki</label></div>
                <div className="input-box"><input type="text" name="dhamanaRangiMuonekanoWaDhamana" placeholder=" " value={form.dhamanaRangiMuonekanoWaDhamana} onChange={handleChange} /><label>Rangi/Muonekano wa dhamana</label></div>
                <div className="input-box"><input type="text" name="dhamanaMahaliIlipo" placeholder=" " value={form.dhamanaMahaliIlipo} onChange={handleChange} /><label>Mahali Ilipo</label></div>
              </div>
            )}

            {/* ========== SEHEMU 7: TAMKO NA WASILISHA ========== */}
            {currentStep === 6 && (
              <div className="tamko-container">
                <div className="tamko-card">
                  <p><strong>Mimi</strong> nimeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa hapo juu ni sahihi kadiri ya ufahamu wangu. Pia nakubali kutembelewa na Afisa mikopo sehemu ya biashara yangu na nyumbani kwangu na kupata taarifa muhimu kutoka kwa watu wengine kwa ajili ya uhakiki wa taarifa zangu kwa matumizi ya ofisi. Pia kwa kujaza fomu hii natoa ridhaa kwa mkopeshaji kutoa taarifa zangu kwenye Taasisi za Kuchakata Taarifa za Wakopaji (CRB) na wadau wengine.</p>
                  <label><input type="checkbox" name="tamkoLaMwombaji" checked={form.tamkoLaMwombaji} onChange={handleChange} /> Ninakubali tamko la mwombaji (Sahihi/Dole Gumba/Tarehe)</label>
                </div>

                <div className="tamko-card">
                  <div className="input-box"><input type="text" name="tamkoUhusiano" placeholder=" " value={form.tamkoUhusiano} onChange={handleChange} /><label>Uhusiano wako na mwombaji (Mume/Mke/Ndugu)</label></div>
                  <p>Mimi ninakiri kuwa na taarifa juu ya mkopo wa Tsh uliyoombwa na kutoka Orethan Microfinance. Dhamana tajwa hapo juu nazifahamu na nipo tayari zitolewe kama dhamana kwa mujibu wa masharti na taratibu zilizokubaliwa na mkopaji na mkopeshaji.</p>
                  <label><input type="checkbox" name="tamkoLaMdhamini" checked={form.tamkoLaMdhamini} onChange={handleChange} /> Ninakubali tamko la mdhamini (Sahihi/Dole Gumba/Tarehe)</label>
                </div>

                <div className="tamko-card">
                  <p><strong>Mimi</strong> nakubali kumdhamini aliyeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa hapo juu ni sahihi kadiri ya ufahamu wangu. Pia, ninatambua na kukubali kwamba nitawajibika kulipa mkopo Pamoja na wajumbe wote wa kikundi endapo mkopaji atashindwa kulipa kama ilivyoainishwa kwenye mkataba.</p>
                  <label><input type="checkbox" name="tamkoLaMdhaminiWajibika" checked={form.tamkoLaMdhaminiWajibika} onChange={handleChange} /> Ninakubali kuwajibika kulipa pamoja na kikundi (Sahihi/Dole Gumba/Tarehe)</label>
                </div>
              </div>
            )}
          </div>

          <div className="button-group">
            {currentStep > 0 && (
              <button type="button" className="btn-prev" onClick={prevStep}>◀ NYUMA</button>
            )}
            {currentStep < steps.length - 1 && (
              <button type="button" className="btn-next" onClick={nextStep}>ENDELEA ▶</button>
            )}
            {currentStep === steps.length - 1 && (
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "INAWASILISHA..." : "📤 WASILISHA MKOPO WA KIKUNDI"}
              </button>
            )}
          </div>
        </form>
      </div>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a, #1e293b);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card {
          width: 100%;
          max-width: 1400px;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(15px);
          padding: 25px;
          border-radius: 24px;
          color: white;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
        }
        h1 { font-size: 22px; margin-bottom: 5px; text-align: center; }
        .card > p { text-align: center; font-size: 13px; opacity: 0.7; margin-bottom: 20px; }
        
        .step-indicators { display: flex; gap: 8px; justify-content: center; margin-bottom: 15px; flex-wrap: wrap; }
        .step-dot { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #334155; color: white; font-size: 14px; font-weight: bold; cursor: pointer; transition: 0.3s; }
        .step-dot.active { background: #06b6d4; box-shadow: 0 0 10px #06b6d4; }
        .step-dot.completed { background: #10b981; }
        .step-title { text-align: center; color: #22d3ee; font-size: 16px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        
        .form-scroll-container { max-height: 55vh; overflow-y: auto; padding-right: 8px; margin-bottom: 20px; }
        .form-scroll-container::-webkit-scrollbar { width: 5px; }
        .form-scroll-container::-webkit-scrollbar-track { background: #1e293b; border-radius: 10px; }
        .form-scroll-container::-webkit-scrollbar-thumb { background: #06b6d4; border-radius: 10px; }
        
        .form-grid-4cols { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
        .full-width { grid-column: 1 / -1; }
        
        .input-box { position: relative; }
        input, select, textarea {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: none;
          outline: none;
          background: rgba(15,23,42,0.9);
          color: white;
          font-size: 13px;
        }
        input:focus, select:focus, textarea:focus { box-shadow: 0 0 0 2px #38bdf8; }
        .input-box label {
          position: absolute;
          left: 12px;
          top: 12px;
          color: #94a3b8;
          transition: 0.2s;
          pointer-events: none;
          font-size: 12px;
        }
        input:focus + label, input:not(:placeholder-shown) + label,
        select:focus + label, select:not(:placeholder-shown) + label,
        textarea:focus + label, textarea:not(:placeholder-shown) + label {
          top: -10px;
          left: 10px;
          font-size: 10px;
          background: #0f172a;
          padding: 0 6px;
          color: #22d3ee;
          border-radius: 5px;
        }
        
        .tamko-container { display: flex; flex-direction: column; gap: 15px; }
        .tamko-card { background: rgba(0,0,0,0.3); padding: 15px; border-radius: 14px; }
        .tamko-card p { font-size: 12px; line-height: 1.5; margin-bottom: 12px; }
        .tamko-card label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 13px; margin-top: 10px; }
        
        .button-group { display: flex; gap: 15px; margin-top: 10px; }
        .btn-next, .btn-submit { flex: 1; padding: 12px; border: none; border-radius: 40px; background: linear-gradient(90deg, #06b6d4, #3b82f6); color: white; font-weight: bold; cursor: pointer; }
        .btn-prev { flex: 1; padding: 12px; border: none; border-radius: 40px; background: #475569; color: white; font-weight: bold; cursor: pointer; }
        button:hover { transform: translateY(-2px); opacity: 0.9; }
        button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        
        @media (max-width: 1200px) { .form-grid-4cols { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 900px) { .form-grid-4cols { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 700px) {
          .card { padding: 18px; max-width: 100%; }
          .form-grid-4cols { grid-template-columns: 1fr; }
          .form-scroll-container { max-height: 50vh; }
          .step-dot { width: 30px; height: 30px; font-size: 12px; }
        }
      `}</style>
    </div>
  );
}

export default GroupLoan;