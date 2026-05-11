import { useState } from "react";
import axios from "axios";

function PersonalLoan() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // SEHEMU I: TAARIFA ZA MWOMBAJI
    jinaKamiliLaMwombaji: "",
    jinsia: "",
    jinaMaarufu: "",
    tareheYaKuzaliwa: "",
    ainaYaKitambulisho: "",
    nambaYaSimu: "",
    nambaYaKitambulisho: "",
    haliYaNdoa: "",
    mahaliUnapoishiMkoa: "",
    mahaliUnapoishiWilaya: "",
    mahaliUnapoishiKata: "",
    mahaliUnapoishiMtaa: "",
    umilikiWaMakazi: "",
    nambaYaNyumba: "",
    umepanga: "",
    umeishiHapoTanguLini: "",
    jinaKamiliLaMumeMke: "",
    simuYaMumeMke: "",
    jinaMaarufuMtaani: "",
    ainaYaKitambulishoChaMumeMke: "",
    nambaYaKitambulishoChaMumeMke: "",
    kaziYaMumeMke: "",
    jinaLaMwajiri: "",
    anuaniYaEneoLaKazi: "",
    idadiYaUtegemezi: "",

    // SEHEMU 2: TAARIFA ZA AJIRA
    jinaLaMwajiriKampuni: "",
    mahaliOfisiIlipo: "",
    wadhifaWako: "",
    umefanyaKaziHapoTanguLini: "",
    mshaharaBaadaYaMakato: "",
    ainaYaAjira: "",
    tareheYaKumalizaMkataba: "",
    tareheYaKustaafu: "",

    // SEHEMU 3: TAARIFA ZA BIASHARA
    jinaLaBiashara: "",
    ainaYaBiashara: "",
    mahaliBiasharaIlipo: "",
    umefanyaBiasharaHiiTanguLini: "",
    jinaLaMmilikiWaEneoLaBiashara: "",
    nambaZakeZaSimu: "",
    wastaniWaKipatoKwaMwezi: "",
    mudaWaMkatabaWaEneoLaBiashara: "",
    wastaniWaMatumiziKwaMwezi: "",

    // SEHEMU 4: KIASI CHA MKOPO KINACHOOMBWA
    kiasiChaMkopo: "",
    kwaManeno: "",
    mudaWaLipaMkopo: "",
    kwaTarakimu: "",
    kiasiGaniChaRejesho: "",
    malengoYaMkopo: "",
    chanzoChaMapato: "",

    // SEHEMU 5: HISTORIA YA MIKOPO
    historia1JinaLaTaasisi: "",
    historia1UlichukuaMkopoLini: "",
    historia1KiasiChaMkopo: "",
    historia1KiasiChaMarejesho: "",
    historia1TareheZaMarejesho: "",
    historia1KiasiKilichobaki: "",
    historia2JinaLaTaasisi: "",
    historia2UlichukuaMkopoLini: "",
    historia2KiasiChaMkopo: "",
    historia2KiasiChaMarejesho: "",
    historia2TareheZaMarejesho: "",
    historia2KiasiKilichobaki: "",
    historia3JinaLaTaasisi: "",
    historia3UlichukuaMkopoLini: "",
    historia3KiasiChaMkopo: "",
    historia3KiasiChaMarejesho: "",
    historia3TareheZaMarejesho: "",
    historia3KiasiKilichobaki: "",

    // SEHEMU 6: DHAMANA YA MKOPO
    dhamanaAinaYaDhamana: "",
    dhamanaNambaZaUsajili: "",
    dhamanaUmiliki: "",
    dhamanaThamaniYakeKwaSasa: "",
    dhamanaMuonekanoWaDhamana: "",

    // SEHEMU 7: TAARIFA ZA WADHAMINI NO. 1
    mdhamini1JinaKamili: "",
    mdhamini1MahaliAnapoishi: "",
    mdhamini1AmepangaKwake: "",
    mdhamini1NambaYaNyumba: "",
    mdhamini1KaziAnayofanya: "",
    mdhamini1UhusianoWenu: "",
    mdhamini1MahaliIlipoOfisiYake: "",
    mdhamini1JinaLaKampuniBiashara: "",
    mdhamini1Simu: "",

    // SEHEMU 7: TAARIFA ZA WADHAMINI NO. 2
    mdhamini2JinaKamili: "",
    mdhamini2MahaliAnapoishi: "",
    mdhamini2AmepangaKwake: "",
    mdhamini2NambaYaNyumba: "",
    mdhamini2KaziAnayofanya: "",
    mdhamini2UhusianoWenu: "",
    mdhamini2MahaliIlipoOfisiYake: "",
    mdhamini2JinaLaKampuniBiashara: "",
    mdhamini2Simu: "",

    // TAMKO
    tamkoLaMwombaji: false,
    tamkoLaMdhamini1: false,
    tamkoLaMdhamini2: false,
  });

  const steps = [
    "SEHEMU I: TAARIFA ZA MWOMBAJI",
    "SEHEMU 2: TAARIFA ZA AJIRA",
    "SEHEMU 3: TAARIFA ZA BIASHARA",
    "SEHEMU 4: KIASI CHA MKOPO",
    "SEHEMU 5: HISTORIA YA MIKOPO",
    "SEHEMU 6: DHAMANA YA MKOPO",
    "SEHEMU 7: WADHAMINI NO. 1",
    "SEHEMU 7: WADHAMINI NO. 2",
    "TAMKO LA MWOMBAJI NA WADHAMINI"
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

    if (!form.tamkoLaMwombaji || !form.tamkoLaMdhamini1 || !form.tamkoLaMdhamini2) {
      alert("Tafadhali kubali tamko la mwombaji na wadhamini wote wawili");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/api/v1/loans", {
        name: form.jinaKamiliLaMwombaji,
        phone: form.nambaYaSimu,
        amount: form.kiasiChaMkopo,
        type: "personal",
        details: form,
      });

      console.log(res.data);
      alert("✅ OMBI LA MKOPO LIMEWASILISHWA KWA MAFANIKIO!");

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
        <h1>📄 OTL FOMU YA MAOMBI YA MKOPO BINAFSI</h1>
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
            {/* ========== SEHEMU I: TAARIFA ZA MWOMBAJI ========== */}
            {currentStep === 0 && (
              <div className="form-grid-2cols">
                <div className="input-box"><input type="text" name="jinaKamiliLaMwombaji" placeholder=" " value={form.jinaKamiliLaMwombaji} onChange={handleChange} /><label>Jina kamili la mwombaji</label></div>
                <div className="input-box"><select name="jinsia" value={form.jinsia} onChange={handleChange}><option value="">Chagua</option><option>Me</option><option>Ke</option></select><label>Jinsia</label></div>
                <div className="input-box"><input type="text" name="jinaMaarufu" placeholder=" " value={form.jinaMaarufu} onChange={handleChange} /><label>Jina maarufu</label></div>
                <div className="input-box"><input type="date" name="tareheYaKuzaliwa" placeholder=" " value={form.tareheYaKuzaliwa} onChange={handleChange} /><label>Tarehe ya kuzaliwa</label></div>
                <div className="input-box"><select name="ainaYaKitambulisho" value={form.ainaYaKitambulisho} onChange={handleChange}><option value="">Chagua</option><option>Kitambulisho cha Taifa</option><option>Pasipoti</option><option>Leseni ya kuendesha</option></select><label>Aina ya kitambulisho</label></div>
                <div className="input-box"><input type="tel" name="nambaYaSimu" placeholder=" " value={form.nambaYaSimu} onChange={handleChange} /><label>Namba ya Simu</label></div>
                <div className="input-box"><input type="text" name="nambaYaKitambulisho" placeholder=" " value={form.nambaYaKitambulisho} onChange={handleChange} /><label>Namba ya kitambulisho</label></div>
                <div className="input-box"><select name="haliYaNdoa" value={form.haliYaNdoa} onChange={handleChange}><option value="">Chagua</option><option>Nimeoa/olewa</option><option>Sijaoa/olewa</option><option>Nimeachika</option><option>Mjane</option></select><label>Hali ya ndoa</label></div>
                <div className="input-box"><input type="text" name="mahaliUnapoishiMkoa" placeholder=" " value={form.mahaliUnapoishiMkoa} onChange={handleChange} /><label>Mkoa</label></div>
                <div className="input-box"><input type="text" name="mahaliUnapoishiWilaya" placeholder=" " value={form.mahaliUnapoishiWilaya} onChange={handleChange} /><label>Wilaya</label></div>
                <div className="input-box"><input type="text" name="mahaliUnapoishiKata" placeholder=" " value={form.mahaliUnapoishiKata} onChange={handleChange} /><label>Kata</label></div>
                <div className="input-box"><input type="text" name="mahaliUnapoishiMtaa" placeholder=" " value={form.mahaliUnapoishiMtaa} onChange={handleChange} /><label>Mtaa</label></div>
                <div className="input-box"><select name="umilikiWaMakazi" value={form.umilikiWaMakazi} onChange={handleChange}><option value="">Chagua</option><option>Kwako</option><option>Mengine (eleza)</option></select><label>Umiliki wa makazi</label></div>
                <div className="input-box"><input type="text" name="nambaYaNyumba" placeholder=" " value={form.nambaYaNyumba} onChange={handleChange} /><label>Namba ya nyumba</label></div>
                <div className="input-box"><select name="umepanga" value={form.umepanga} onChange={handleChange}><option value="">Chagua</option><option>Ndio</option><option>Hapana</option></select><label>Umpanga</label></div>
                <div className="input-box"><input type="text" name="umeishiHapoTanguLini" placeholder=" " value={form.umeishiHapoTanguLini} onChange={handleChange} /><label>Umeishi hapo tangu lini?</label></div>
                <div className="input-box"><input type="text" name="jinaKamiliLaMumeMke" placeholder=" " value={form.jinaKamiliLaMumeMke} onChange={handleChange} /><label>Jina kamili la mume/mke</label></div>
                <div className="input-box"><input type="tel" name="simuYaMumeMke" placeholder=" " value={form.simuYaMumeMke} onChange={handleChange} /><label>Simu ya mume/mke</label></div>
                <div className="input-box"><input type="text" name="jinaMaarufuMtaani" placeholder=" " value={form.jinaMaarufuMtaani} onChange={handleChange} /><label>Jina maarufu mtaani</label></div>
                <div className="input-box"><select name="ainaYaKitambulishoChaMumeMke" value={form.ainaYaKitambulishoChaMumeMke} onChange={handleChange}><option value="">Chagua</option><option>Kitambulisho cha Taifa</option><option>Pasipoti</option></select><label>Aina ya kitambulisho cha mume/mke</label></div>
                <div className="input-box"><input type="text" name="nambaYaKitambulishoChaMumeMke" placeholder=" " value={form.nambaYaKitambulishoChaMumeMke} onChange={handleChange} /><label>Namba ya Kitambulisho</label></div>
                <div className="input-box"><input type="text" name="kaziYaMumeMke" placeholder=" " value={form.kaziYaMumeMke} onChange={handleChange} /><label>Kazi ya mume/mke</label></div>
                <div className="input-box"><input type="text" name="jinaLaMwajiri" placeholder=" " value={form.jinaLaMwajiri} onChange={handleChange} /><label>Jina la mwajiri</label></div>
                <div className="input-box"><input type="text" name="anuaniYaEneoLaKazi" placeholder=" " value={form.anuaniYaEneoLaKazi} onChange={handleChange} /><label>Anuani ya eneo la kazi</label></div>
                <div className="input-box"><input type="text" name="idadiYaUtegemezi" placeholder=" " value={form.idadiYaUtegemezi} onChange={handleChange} /><label>Idadi ya utegemezi</label></div>
              </div>
            )}

            {/* ========== SEHEMU 2: TAARIFA ZA AJIRA ========== */}
            {currentStep === 1 && (
              <div className="form-grid-2cols">
                <div className="input-box"><input type="text" name="jinaLaMwajiriKampuni" placeholder=" " value={form.jinaLaMwajiriKampuni} onChange={handleChange} /><label>Jina la Mwajiri/kampuni</label></div>
                <div className="input-box"><input type="text" name="mahaliOfisiIlipo" placeholder=" " value={form.mahaliOfisiIlipo} onChange={handleChange} /><label>Mahali Ofisi ilipo</label></div>
                <div className="input-box"><input type="text" name="wadhifaWako" placeholder=" " value={form.wadhifaWako} onChange={handleChange} /><label>Wadhifa wako</label></div>
                <div className="input-box"><input type="text" name="umefanyaKaziHapoTanguLini" placeholder=" " value={form.umefanyaKaziHapoTanguLini} onChange={handleChange} /><label>Umefanya kazi hapo toka lini</label></div>
                <div className="input-box"><input type="text" name="mshaharaBaadaYaMakato" placeholder=" " value={form.mshaharaBaadaYaMakato} onChange={handleChange} /><label>Mshahara baada ya makato</label></div>
                <div className="input-box"><select name="ainaYaAjira" value={form.ainaYaAjira} onChange={handleChange}><option value="">Chagua</option><option>Kudumu</option><option>Mkataba</option><option>Ya muda mfupi</option></select><label>Aina ya ajira</label></div>
                <div className="input-box"><input type="date" name="tareheYaKumalizaMkataba" placeholder=" " value={form.tareheYaKumalizaMkataba} onChange={handleChange} /><label>Tarehe ya kumaliza mkataba</label></div>
                <div className="input-box"><input type="date" name="tareheYaKustaafu" placeholder=" " value={form.tareheYaKustaafu} onChange={handleChange} /><label>Tarehe ya kustaafu</label></div>
              </div>
            )}

            {/* ========== SEHEMU 3: TAARIFA ZA BIASHARA ========== */}
            {currentStep === 2 && (
              <div className="form-grid-2cols">
                <div className="input-box"><input type="text" name="jinaLaBiashara" placeholder=" " value={form.jinaLaBiashara} onChange={handleChange} /><label>Jina la Biashara</label></div>
                <div className="input-box"><input type="text" name="ainaYaBiashara" placeholder=" " value={form.ainaYaBiashara} onChange={handleChange} /><label>Aina ya Biashara</label></div>
                <div className="input-box"><input type="text" name="mahaliBiasharaIlipo" placeholder=" " value={form.mahaliBiasharaIlipo} onChange={handleChange} /><label>Mahali Biashara Ilipo</label></div>
                <div className="input-box"><input type="text" name="umefanyaBiasharaHiiTanguLini" placeholder=" " value={form.umefanyaBiasharaHiiTanguLini} onChange={handleChange} /><label>Umefanya Biashara hii tangu lini</label></div>
                <div className="input-box"><input type="text" name="jinaLaMmilikiWaEneoLaBiashara" placeholder=" " value={form.jinaLaMmilikiWaEneoLaBiashara} onChange={handleChange} /><label>Jina la mmiliki wa eneo la biashara</label></div>
                <div className="input-box"><input type="tel" name="nambaZakeZaSimu" placeholder=" " value={form.nambaZakeZaSimu} onChange={handleChange} /><label>Namba zake za simu</label></div>
                <div className="input-box"><input type="text" name="wastaniWaKipatoKwaMwezi" placeholder=" " value={form.wastaniWaKipatoKwaMwezi} onChange={handleChange} /><label>Wastani wa kipato kwa mwezi</label></div>
                <div className="input-box"><input type="text" name="mudaWaMkatabaWaEneoLaBiashara" placeholder=" " value={form.mudaWaMkatabaWaEneoLaBiashara} onChange={handleChange} /><label>Muda wa mkataba wa eneo la biashara</label></div>
                <div className="input-box"><input type="text" name="wastaniWaMatumiziKwaMwezi" placeholder=" " value={form.wastaniWaMatumiziKwaMwezi} onChange={handleChange} /><label>Wastani wa matumizi kwa mwezi</label></div>
              </div>
            )}

            {/* ========== SEHEMU 4: KIASI CHA MKOPO KINACHOOMBWA ========== */}
            {currentStep === 3 && (
              <div className="form-grid-2cols">
                <div className="input-box"><input type="text" name="kiasiChaMkopo" placeholder=" " value={form.kiasiChaMkopo} onChange={handleChange} /><label>Kiasi cha Mkopo (Kwa tarakimu)</label></div>
                <div className="input-box"><input type="text" name="kwaManeno" placeholder=" " value={form.kwaManeno} onChange={handleChange} /><label>Kwa maneno</label></div>
                <div className="input-box"><input type="text" name="mudaWaLipaMkopo" placeholder=" " value={form.mudaWaLipaMkopo} onChange={handleChange} /><label>Muda wa kulipa Mkopo</label></div>
                <div className="input-box"><input type="text" name="kwaTarakimu" placeholder=" " value={form.kwaTarakimu} onChange={handleChange} /><label>Kwa tarakimu (miezi)</label></div>
                <div className="input-box"><input type="text" name="kiasiGaniChaRejesho" placeholder=" " value={form.kiasiGaniChaRejesho} onChange={handleChange} /><label>Ni kiasi gani cha rejesho unaweza kulipa bila matatizo?</label></div>
                <div className="input-box full-width"><textarea name="malengoYaMkopo" placeholder=" " rows={2} value={form.malengoYaMkopo} onChange={handleChange}></textarea><label>Malengo ya Mkopo</label></div>
                <div className="input-box"><input type="text" name="chanzoChaMapato" placeholder=" " value={form.chanzoChaMapato} onChange={handleChange} /><label>Chanzo cha Mapato</label></div>
              </div>
            )}

            {/* ========== SEHEMU 5: HISTORIA YA MIKOPO ========== */}
            {currentStep === 4 && (
              <div className="form-grid-2cols">
                <h4 style={{ gridColumn: "1/-1", color: "#22d3ee", margin: "10px 0 5px 0" }}>📌 Mkopo #1</h4>
                <div className="input-box"><input type="text" name="historia1JinaLaTaasisi" placeholder=" " value={form.historia1JinaLaTaasisi} onChange={handleChange} /><label>Jina la Taasisi</label></div>
                <div className="input-box"><input type="text" name="historia1UlichukuaMkopoLini" placeholder=" " value={form.historia1UlichukuaMkopoLini} onChange={handleChange} /><label>Ulichukua Mkopo lini</label></div>
                <div className="input-box"><input type="text" name="historia1KiasiChaMkopo" placeholder=" " value={form.historia1KiasiChaMkopo} onChange={handleChange} /><label>Kiasi cha mkopo</label></div>
                <div className="input-box"><input type="text" name="historia1KiasiChaMarejesho" placeholder=" " value={form.historia1KiasiChaMarejesho} onChange={handleChange} /><label>Kiasi cha marejesho</label></div>
                <div className="input-box"><input type="text" name="historia1TareheZaMarejesho" placeholder=" " value={form.historia1TareheZaMarejesho} onChange={handleChange} /><label>Tarehe za marejesho</label></div>
                <div className="input-box"><input type="text" name="historia1KiasiKilichobaki" placeholder=" " value={form.historia1KiasiKilichobaki} onChange={handleChange} /><label>Kiasi kilichobaki</label></div>
                
                <h4 style={{ gridColumn: "1/-1", color: "#22d3ee", margin: "10px 0 5px 0" }}>📌 Mkopo #2</h4>
                <div className="input-box"><input type="text" name="historia2JinaLaTaasisi" placeholder=" " value={form.historia2JinaLaTaasisi} onChange={handleChange} /><label>Jina la Taasisi</label></div>
                <div className="input-box"><input type="text" name="historia2UlichukuaMkopoLini" placeholder=" " value={form.historia2UlichukuaMkopoLini} onChange={handleChange} /><label>Ulichukua Mkopo lini</label></div>
                <div className="input-box"><input type="text" name="historia2KiasiChaMkopo" placeholder=" " value={form.historia2KiasiChaMkopo} onChange={handleChange} /><label>Kiasi cha mkopo</label></div>
                <div className="input-box"><input type="text" name="historia2KiasiChaMarejesho" placeholder=" " value={form.historia2KiasiChaMarejesho} onChange={handleChange} /><label>Kiasi cha marejesho</label></div>
                <div className="input-box"><input type="text" name="historia2TareheZaMarejesho" placeholder=" " value={form.historia2TareheZaMarejesho} onChange={handleChange} /><label>Tarehe za marejesho</label></div>
                <div className="input-box"><input type="text" name="historia2KiasiKilichobaki" placeholder=" " value={form.historia2KiasiKilichobaki} onChange={handleChange} /><label>Kiasi kilichobaki</label></div>
                
                <h4 style={{ gridColumn: "1/-1", color: "#22d3ee", margin: "10px 0 5px 0" }}>📌 Mkopo #3</h4>
                <div className="input-box"><input type="text" name="historia3JinaLaTaasisi" placeholder=" " value={form.historia3JinaLaTaasisi} onChange={handleChange} /><label>Jina la Taasisi</label></div>
                <div className="input-box"><input type="text" name="historia3UlichukuaMkopoLini" placeholder=" " value={form.historia3UlichukuaMkopoLini} onChange={handleChange} /><label>Ulichukua Mkopo lini</label></div>
                <div className="input-box"><input type="text" name="historia3KiasiChaMkopo" placeholder=" " value={form.historia3KiasiChaMkopo} onChange={handleChange} /><label>Kiasi cha mkopo</label></div>
                <div className="input-box"><input type="text" name="historia3KiasiChaMarejesho" placeholder=" " value={form.historia3KiasiChaMarejesho} onChange={handleChange} /><label>Kiasi cha marejesho</label></div>
                <div className="input-box"><input type="text" name="historia3TareheZaMarejesho" placeholder=" " value={form.historia3TareheZaMarejesho} onChange={handleChange} /><label>Tarehe za marejesho</label></div>
                <div className="input-box"><input type="text" name="historia3KiasiKilichobaki" placeholder=" " value={form.historia3KiasiKilichobaki} onChange={handleChange} /><label>Kiasi kilichobaki</label></div>
              </div>
            )}

            {/* ========== SEHEMU 6: DHAMANA YA MKOPO ========== */}
            {currentStep === 5 && (
              <div className="form-grid-2cols">
                <div className="input-box"><input type="text" name="dhamanaAinaYaDhamana" placeholder=" " value={form.dhamanaAinaYaDhamana} onChange={handleChange} /><label>Aina ya dhamana</label></div>
                <div className="input-box"><input type="text" name="dhamanaNambaZaUsajili" placeholder=" " value={form.dhamanaNambaZaUsajili} onChange={handleChange} /><label>Namba za usajili</label></div>
                <div className="input-box"><input type="text" name="dhamanaUmiliki" placeholder=" " value={form.dhamanaUmiliki} onChange={handleChange} /><label>Umiliki</label></div>
                <div className="input-box"><input type="text" name="dhamanaThamaniYakeKwaSasa" placeholder=" " value={form.dhamanaThamaniYakeKwaSasa} onChange={handleChange} /><label>Thamani yake kwa sasa</label></div>
                <div className="input-box"><select name="dhamanaMuonekanoWaDhamana" value={form.dhamanaMuonekanoWaDhamana} onChange={handleChange}><option value="">Chagua</option><option>Nzuri sana</option><option>Nzuri</option><option>Kuridhisha</option><option>Inahitaji matengenezo</option></select><label>Muonekano wa dhamana</label></div>
              </div>
            )}

            {/* ========== SEHEMU 7: WADHAMINI NO. 1 ========== */}
            {currentStep === 6 && (
              <div className="form-grid-2cols">
                <div className="input-box"><input type="text" name="mdhamini1JinaKamili" placeholder=" " value={form.mdhamini1JinaKamili} onChange={handleChange} /><label>Jina kamili la Mdhamini</label></div>
                <div className="input-box"><input type="text" name="mdhamini1MahaliAnapoishi" placeholder=" " value={form.mdhamini1MahaliAnapoishi} onChange={handleChange} /><label>Mahali Anapoishi</label></div>
                <div className="input-box"><select name="mdhamini1AmepangaKwake" value={form.mdhamini1AmepangaKwake} onChange={handleChange}><option value="">Chagua</option><option>Amepanga</option><option>Kwake</option></select><label>Amepanga/ kwake</label></div>
                <div className="input-box"><input type="text" name="mdhamini1NambaYaNyumba" placeholder=" " value={form.mdhamini1NambaYaNyumba} onChange={handleChange} /><label>Namba ya nyumba</label></div>
                <div className="input-box"><input type="text" name="mdhamini1KaziAnayofanya" placeholder=" " value={form.mdhamini1KaziAnayofanya} onChange={handleChange} /><label>Kazi Anayofanya</label></div>
                <div className="input-box"><input type="text" name="mdhamini1UhusianoWenu" placeholder=" " value={form.mdhamini1UhusianoWenu} onChange={handleChange} /><label>Uhusiano wenu</label></div>
                <div className="input-box"><input type="text" name="mdhamini1MahaliIlipoOfisiYake" placeholder=" " value={form.mdhamini1MahaliIlipoOfisiYake} onChange={handleChange} /><label>Mahali ilipo Ofisi yake</label></div>
                <div className="input-box"><input type="text" name="mdhamini1JinaLaKampuniBiashara" placeholder=" " value={form.mdhamini1JinaLaKampuniBiashara} onChange={handleChange} /><label>Jina la kampuni/ biashara</label></div>
                <div className="input-box"><input type="tel" name="mdhamini1Simu" placeholder=" " value={form.mdhamini1Simu} onChange={handleChange} /><label>Simu</label></div>
              </div>
            )}

            {/* ========== SEHEMU 7: WADHAMINI NO. 2 ========== */}
            {currentStep === 7 && (
              <div className="form-grid-2cols">
                <div className="input-box"><input type="text" name="mdhamini2JinaKamili" placeholder=" " value={form.mdhamini2JinaKamili} onChange={handleChange} /><label>Jina kamili la Mdhamini</label></div>
                <div className="input-box"><input type="text" name="mdhamini2MahaliAnapoishi" placeholder=" " value={form.mdhamini2MahaliAnapoishi} onChange={handleChange} /><label>Mahali Anapoishi</label></div>
                <div className="input-box"><select name="mdhamini2AmepangaKwake" value={form.mdhamini2AmepangaKwake} onChange={handleChange}><option value="">Chagua</option><option>Amepanga</option><option>Kwake</option></select><label>Amepanga/ kwake</label></div>
                <div className="input-box"><input type="text" name="mdhamini2NambaYaNyumba" placeholder=" " value={form.mdhamini2NambaYaNyumba} onChange={handleChange} /><label>Namba ya nyumba</label></div>
                <div className="input-box"><input type="text" name="mdhamini2KaziAnayofanya" placeholder=" " value={form.mdhamini2KaziAnayofanya} onChange={handleChange} /><label>Kazi Anayofanya</label></div>
                <div className="input-box"><input type="text" name="mdhamini2UhusianoWenu" placeholder=" " value={form.mdhamini2UhusianoWenu} onChange={handleChange} /><label>Uhusiano wenu</label></div>
                <div className="input-box"><input type="text" name="mdhamini2MahaliIlipoOfisiYake" placeholder=" " value={form.mdhamini2MahaliIlipoOfisiYake} onChange={handleChange} /><label>Mahali ilipo Ofisi yake</label></div>
                <div className="input-box"><input type="text" name="mdhamini2JinaLaKampuniBiashara" placeholder=" " value={form.mdhamini2JinaLaKampuniBiashara} onChange={handleChange} /><label>Jina la kampuni/ biashara</label></div>
                <div className="input-box"><input type="tel" name="mdhamini2Simu" placeholder=" " value={form.mdhamini2Simu} onChange={handleChange} /><label>Simu</label></div>
              </div>
            )}

            {/* ========== TAMKO LA MWOMBAJI NA WADHAMINI ========== */}
            {currentStep === 8 && (
              <div className="tamko-container">
                <div className="tamko-card">
                  <p><strong>Mimi</strong> nimeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa hapo juu ni sahihi kadiri ya ufahamu wangu. Nakubali kutembelewa na Afisa mikopo sehemu ya biashara yangu na nyumbani kwangu na kupata taarifa muhimu kutoka kwa watu wengine kwa ajili ya uhakiki wa taarifa zangu. Pia kwa kujaza fomu hii natoa ridhaa kwa mkopeshaji kutoa taarifa zangu kwenye Taasisi za Kuchakata Taarifa za Wakopaji (CRB) na wadau wengine.</p>
                  <label><input type="checkbox" name="tamkoLaMwombaji" checked={form.tamkoLaMwombaji} onChange={handleChange} /> Ninakubali tamko la mwombaji</label>
                </div>
                <div className="tamko-card">
                  <p><strong>Mdhamini 1:</strong> Ninakubali kumdhamini aliyeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa ni sahihi. Natambua kuwa nitawajibika kulipa mkopo huu kama ikitokea mwombaji ameshindwa kulipa.</p>
                  <label><input type="checkbox" name="tamkoLaMdhamini1" checked={form.tamkoLaMdhamini1} onChange={handleChange} /> Mdhamini 1 anakubali</label>
                </div>
                <div className="tamko-card">
                  <p><strong>Mdhamini 2:</strong> Ninakubali kumdhamini aliyeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa ni sahihi. Natambua kuwa nitawajibika kulipa mkopo huu kama ikitokea mwombaji ameshindwa kulipa.</p>
                  <label><input type="checkbox" name="tamkoLaMdhamini2" checked={form.tamkoLaMdhamini2} onChange={handleChange} /> Mdhamini 2 anakubali</label>
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
                {loading ? "INAWASILISHA..." : "📤 WASILISHA MKOPO"}
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
          max-width: 900px;
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
        
        .form-grid-2cols { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
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
        .tamko-card label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 13px; }
        
        .button-group { display: flex; gap: 15px; margin-top: 10px; }
        .btn-next, .btn-submit { flex: 1; padding: 12px; border: none; border-radius: 40px; background: linear-gradient(90deg, #06b6d4, #3b82f6); color: white; font-weight: bold; cursor: pointer; }
        .btn-prev { flex: 1; padding: 12px; border: none; border-radius: 40px; background: #475569; color: white; font-weight: bold; cursor: pointer; }
        button:hover { transform: translateY(-2px); opacity: 0.9; }
        button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        
        @media (max-width: 700px) {
          .card { padding: 18px; }
          .form-grid-2cols { grid-template-columns: 1fr; gap: 12px; }
          .form-scroll-container { max-height: 50vh; }
          .step-dot { width: 30px; height: 30px; font-size: 12px; }
        }
      `}</style>
    </div>
  );
}

export default PersonalLoan;