import { useState } from "react";
import axios from "axios";

function PersonalLoan() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    // ========== SEHEMU I: TAARIFA ZA MWOMBAJI ==========
    fomuNo: "",
    jinaKamiliMwombaji: "",
    jinsia: "",
    jinaMaarufu: "",
    tareheKuzaliwa: "",
    ainaKitambulisho: "",
    nambaSimu: "",
    nambaKitambulisho: "",
    haliNdoa: "",
    mahaliUnapoishiMkoa: "",
    mahaliUnapoishiWilaya: "",
    mahaliUnapoishiKata: "",
    mahaliUnapoishiMtaa: "",
    umilikiMakazi: "",
    umilikiMakaziMengine: "",
    nambaNyumba: "",
    umepanga: "",
    umeishiHapoTanguLini: "",
    jinaKamiliMumeMke: "",
    simuMumeMke: "",
    jinaMaarufuMtaani: "",
    ainaKitambulishoMumeMke: "",
    nambaKitambulishoMumeMke: "",
    kaziMumeMke: "",
    jinaMwajiri: "",
    simuMwajiri: "",
    anuaniEneoKazi: "",
    idadiUtegemezi: "",

    // ========== SEHEMU 2: TAARIFA ZA AJIRA ==========
    jinaMwajiriKampuni: "",
    mahaliOfisiIlipo: "",
    wadhifaWako: "",
    umefanyaKaziHapoTanguLini: "",
    mshaharaBaadaMakato: "",
    ainaAjira: "",
    tareheKumalizaMkataba: "",
    tareheKustaafu: "",

    // ========== SEHEMU 3: TAARIFA ZA BIASHARA ==========
    jinaBiashara: "",
    ainaBiashara: "",
    mahaliBiasharaIlipo: "",
    umefanyaBiasharaTanguLini: "",
    jinaMmilikiEneoBiashara: "",
    nambaSimuMmilikiEneo: "",
    wastaniKipatoKwaMwezi: "",
    mudaMkatabaEneoBiashara: "",
    wastaniMatumiziKwaMwezi: "",

    // ========== SEHEMU 4: KIASI CHA MKOPO KINACHOOMBWA ==========
    kiasiMkopo: "",
    kwaManeno: "",
    mudaKulipaMkopo: "",
    kwaTarakimu: "",
    kiasiRejeshoBilaMatatizo: "",
    malengoMkopo: "",
    chanzoMapato: "",

    // ========== SEHEMU 5: HISTORIA YA MIKOPO ==========
    historia1JinaTaasisi: "",
    historia1UlichukuaLini: "",
    historia1KiasiMkopo: "",
    historia1KiasiMarejesho: "",
    historia1TareheMarejesho: "",
    historia1KiasiKilichobaki: "",
    historia2JinaTaasisi: "",
    historia2UlichukuaLini: "",
    historia2KiasiMkopo: "",
    historia2KiasiMarejesho: "",
    historia2TareheMarejesho: "",
    historia2KiasiKilichobaki: "",
    historia3JinaTaasisi: "",
    historia3UlichukuaLini: "",
    historia3KiasiMkopo: "",
    historia3KiasiMarejesho: "",
    historia3TareheMarejesho: "",
    historia3KiasiKilichobaki: "",

    // ========== SEHEMU 6: DHAMANA YA MKOPO ==========
    dhamanaAina: "",
    dhamanaNambaUsajili: "",
    dhamanaUmiliki: "",
    dhamanaThamaniKwaSasa: "",
    dhamanaMuonekano: "",

    // ========== SEHEMU 7: TAARIFA ZA WADHAMINI NO. 1 ==========
    wdhamini1JinaKamili: "",
    wdhamini1MahaliAnapoishi: "",
    wdhamini1AmepangaKwake: "",
    wdhamini1NambaNyumba: "",
    wdhamini1KaziAnayofanya: "",
    wdhamini1UhusianoWenu: "",
    wdhamini1MahaliOfisiYake: "",
    wdhamini1JinaKampuniBiashara: "",
    wdhamini1Simu: "",

    // ========== SEHEMU 7: TAARIFA ZA WADHAMINI NO. 2 ==========
    wdhamini2JinaKamili: "",
    wdhamini2MahaliAnapoishi: "",
    wdhamini2AmepangaKwake: "",
    wdhamini2NambaNyumba: "",
    wdhamini2KaziAnayofanya: "",
    wdhamini2UhusianoWenu: "",
    wdhamini2MahaliOfisiYake: "",
    wdhamini2JinaKampuniBiashara: "",
    wdhamini2Simu: "",

    // ========== TAMKO ==========
    tamkoMwombaji: false,
    tamkoMdhamini1: false,
    tamkoMdhamini2: false,
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

    if (!form.tamkoMwombaji || !form.tamkoMdhamini1 || !form.tamkoMdhamini2) {
      alert("Tafadhali kubali tamko la mwombaji na wadhamini wote wawili");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://127.0.0.1:8000/api/v1/loans", {
        name: form.jinaKamiliMwombaji,
        phone: form.nambaSimu,
        amount: form.kiasiMkopo,
        type: "personal",
        details: form,
      });

      console.log(res.data);
      alert("✅ OMBI LA MKOPO LIMEWASILISHWA KWA MAFANIKIO!");
      
      // Reset form after submit if needed
      // setCurrentStep(0);
      
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
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>Fomu No: ................</div>
        </div>
        <h1>📄 OTL FOMU YA MAOMBI YA MKOPO BINAFSI</h1>
        <p>Orethan Microfinance · Jaza taarifa zote kwa makini</p>

        {/* Step Indicators */}
        <div className="step-indicators">
          {steps.map((_, idx) => (
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
            
            {/* ========== SEHEMU I: TAARIFA ZA MWOMBAJI (SAFU 4) ========== */}
            {currentStep === 0 && (
              <div className="form-grid-4cols">
                <div className="input-box"><input type="text" name="jinaKamiliMwombaji" placeholder=" " value={form.jinaKamiliMwombaji} onChange={handleChange} /><label>Jina kamili la mwombaji</label></div>
                <div className="input-box"><select name="jinsia" value={form.jinsia} onChange={handleChange}><option value="">Chagua</option><option>Me</option><option>Ke</option></select><label>Jinsia</label></div>
                <div className="input-box"><input type="text" name="jinaMaarufu" placeholder=" " value={form.jinaMaarufu} onChange={handleChange} /><label>Jina maarufu</label></div>
                <div className="input-box"><input type="date" name="tareheKuzaliwa" placeholder=" " value={form.tareheKuzaliwa} onChange={handleChange} /><label>Tarehe ya kuzaliwa</label></div>
                <div className="input-box"><select name="ainaKitambulisho" value={form.ainaKitambulisho} onChange={handleChange}><option value="">Chagua</option><option>Kitambulisho cha Taifa</option><option>Pasipoti</option><option>Leseni ya kuendesha</option><option>Kitambulisho cha Mpiga Kura</option></select><label>Aina ya kitambulisho</label></div>
                <div className="input-box"><input type="tel" name="nambaSimu" placeholder=" " value={form.nambaSimu} onChange={handleChange} /><label>Namba ya Simu</label></div>
                <div className="input-box"><input type="text" name="nambaKitambulisho" placeholder=" " value={form.nambaKitambulisho} onChange={handleChange} /><label>Namba ya kitambulisho</label></div>
                <div className="input-box"><select name="haliNdoa" value={form.haliNdoa} onChange={handleChange}><option value="">Chagua</option><option>Nimeoa/olewa</option><option>Sijaoa/olewa</option><option>Nimeachika</option><option>Mjane</option></select><label>Hali ya ndoa</label></div>
                <div className="input-box"><input type="text" name="mahaliUnapoishiMkoa" placeholder=" " value={form.mahaliUnapoishiMkoa} onChange={handleChange} /><label>Mahali unapoishi - Mkoa</label></div>
                <div className="input-box"><input type="text" name="mahaliUnapoishiWilaya" placeholder=" " value={form.mahaliUnapoishiWilaya} onChange={handleChange} /><label>Wilaya</label></div>
                <div className="input-box"><input type="text" name="mahaliUnapoishiKata" placeholder=" " value={form.mahaliUnapoishiKata} onChange={handleChange} /><label>Kata</label></div>
                <div className="input-box"><input type="text" name="mahaliUnapoishiMtaa" placeholder=" " value={form.mahaliUnapoishiMtaa} onChange={handleChange} /><label>Mtaa</label></div>
                <div className="input-box"><select name="umilikiMakazi" value={form.umilikiMakazi} onChange={handleChange}><option value="">Chagua</option><option>Kwako</option><option>Mengine (eleza)</option></select><label>Umiliki wa makazi</label></div>
                <div className="input-box"><input type="text" name="nambaNyumba" placeholder=" " value={form.nambaNyumba} onChange={handleChange} /><label>Namba ya nyumba</label></div>
                <div className="input-box"><select name="umepanga" value={form.umepanga} onChange={handleChange}><option value="">Chagua</option><option>Ndio</option><option>Hapana</option></select><label>Umpanga</label></div>
                <div className="input-box"><input type="text" name="umeishiHapoTanguLini" placeholder=" " value={form.umeishiHapoTanguLini} onChange={handleChange} /><label>Umeishi hapo tangu lini?</label></div>
                <div className="input-box"><input type="text" name="jinaKamiliMumeMke" placeholder=" " value={form.jinaKamiliMumeMke} onChange={handleChange} /><label>Jina kamili la mume/mke</label></div>
                <div className="input-box"><input type="tel" name="simuMumeMke" placeholder=" " value={form.simuMumeMke} onChange={handleChange} /><label>Simu ya mume/mke</label></div>
                <div className="input-box"><input type="text" name="jinaMaarufuMtaani" placeholder=" " value={form.jinaMaarufuMtaani} onChange={handleChange} /><label>Jina maarufu mtaani</label></div>
                <div className="input-box"><select name="ainaKitambulishoMumeMke" value={form.ainaKitambulishoMumeMke} onChange={handleChange}><option value="">Chagua</option><option>Kitambulisho cha Taifa</option><option>Pasipoti</option></select><label>Aina ya kitambulisho</label></div>
                <div className="input-box"><input type="text" name="nambaKitambulishoMumeMke" placeholder=" " value={form.nambaKitambulishoMumeMke} onChange={handleChange} /><label>Namba ya Kitambulisho</label></div>
                <div className="input-box"><input type="text" name="kaziMumeMke" placeholder=" " value={form.kaziMumeMke} onChange={handleChange} /><label>Kazi ya mume/mke</label></div>
                <div className="input-box"><input type="text" name="jinaMwajiri" placeholder=" " value={form.jinaMwajiri} onChange={handleChange} /><label>Jina la mwajiri</label></div>
                <div className="input-box"><input type="tel" name="simuMwajiri" placeholder=" " value={form.simuMwajiri} onChange={handleChange} /><label>Simu ya mwajiri</label></div>
                <div className="input-box"><input type="text" name="anuaniEneoKazi" placeholder=" " value={form.anuaniEneoKazi} onChange={handleChange} /><label>Anuani ya eneo la kazi</label></div>
                <div className="input-box"><input type="text" name="idadiUtegemezi" placeholder=" " value={form.idadiUtegemezi} onChange={handleChange} /><label>Idadi ya utegemezi</label></div>
              </div>
            )}

            {/* ========== SEHEMU 2: TAARIFA ZA AJIRA ========== */}
            {currentStep === 1 && (
              <div className="form-grid-4cols">
                <div className="input-box"><input type="text" name="jinaMwajiriKampuni" placeholder=" " value={form.jinaMwajiriKampuni} onChange={handleChange} /><label>Jina la Mwajiri/kampuni</label></div>
                <div className="input-box"><input type="text" name="mahaliOfisiIlipo" placeholder=" " value={form.mahaliOfisiIlipo} onChange={handleChange} /><label>Mahali Ofisi ilipo</label></div>
                <div className="input-box"><input type="text" name="wadhifaWako" placeholder=" " value={form.wadhifaWako} onChange={handleChange} /><label>Wadhifa wako</label></div>
                <div className="input-box"><input type="text" name="umefanyaKaziHapoTanguLini" placeholder=" " value={form.umefanyaKaziHapoTanguLini} onChange={handleChange} /><label>Umefanya kazi hapo toka lini</label></div>
                <div className="input-box"><input type="text" name="mshaharaBaadaMakato" placeholder=" " value={form.mshaharaBaadaMakato} onChange={handleChange} /><label>Mshahara baada ya makato</label></div>
                <div className="input-box"><select name="ainaAjira" value={form.ainaAjira} onChange={handleChange}><option value="">Chagua</option><option>Kudumu</option><option>Mkataba</option><option>Ya muda mfupi</option></select><label>Aina ya ajira</label></div>
                <div className="input-box"><input type="date" name="tareheKumalizaMkataba" placeholder=" " value={form.tareheKumalizaMkataba} onChange={handleChange} /><label>Tarehe ya kumaliza mkataba</label></div>
                <div className="input-box"><input type="date" name="tareheKustaafu" placeholder=" " value={form.tareheKustaafu} onChange={handleChange} /><label>Tarehe ya kustaafu</label></div>
              </div>
            )}

            {/* ========== SEHEMU 3: TAARIFA ZA BIASHARA ========== */}
            {currentStep === 2 && (
              <div className="form-grid-4cols">
                <div className="input-box"><input type="text" name="jinaBiashara" placeholder=" " value={form.jinaBiashara} onChange={handleChange} /><label>Jina la Biashara</label></div>
                <div className="input-box"><input type="text" name="ainaBiashara" placeholder=" " value={form.ainaBiashara} onChange={handleChange} /><label>Aina ya Biashara</label></div>
                <div className="input-box"><input type="text" name="mahaliBiasharaIlipo" placeholder=" " value={form.mahaliBiasharaIlipo} onChange={handleChange} /><label>Mahali Biashara Ilipo</label></div>
                <div className="input-box"><input type="text" name="umefanyaBiasharaTanguLini" placeholder=" " value={form.umefanyaBiasharaTanguLini} onChange={handleChange} /><label>Umefanya Biashara hii tangu lini</label></div>
                <div className="input-box"><input type="text" name="jinaMmilikiEneoBiashara" placeholder=" " value={form.jinaMmilikiEneoBiashara} onChange={handleChange} /><label>Jina la mmiliki wa eneo la biashara</label></div>
                <div className="input-box"><input type="tel" name="nambaSimuMmilikiEneo" placeholder=" " value={form.nambaSimuMmilikiEneo} onChange={handleChange} /><label>Namba zake za simu</label></div>
                <div className="input-box"><input type="text" name="wastaniKipatoKwaMwezi" placeholder=" " value={form.wastaniKipatoKwaMwezi} onChange={handleChange} /><label>Wastani wa kipato kwa mwezi</label></div>
                <div className="input-box"><input type="text" name="mudaMkatabaEneoBiashara" placeholder=" " value={form.mudaMkatabaEneoBiashara} onChange={handleChange} /><label>Muda wa mkataba wa eneo la biashara</label></div>
                <div className="input-box"><input type="text" name="wastaniMatumiziKwaMwezi" placeholder=" " value={form.wastaniMatumiziKwaMwezi} onChange={handleChange} /><label>Wastani wa matumizi kwa mwezi</label></div>
              </div>
            )}

            {/* ========== SEHEMU 4: KIASI CHA MKOPO KINACHOOMBWA ========== */}
            {currentStep === 3 && (
              <div className="form-grid-4cols">
                <div className="input-box"><input type="text" name="kiasiMkopo" placeholder=" " value={form.kiasiMkopo} onChange={handleChange} /><label>Kiasi cha Mkopo</label></div>
                <div className="input-box"><input type="text" name="kwaManeno" placeholder=" " value={form.kwaManeno} onChange={handleChange} /><label>Kwa maneno</label></div>
                <div className="input-box"><input type="text" name="mudaKulipaMkopo" placeholder=" " value={form.mudaKulipaMkopo} onChange={handleChange} /><label>Muda wa kulipa Mkopo</label></div>
                <div className="input-box"><input type="text" name="kwaTarakimu" placeholder=" " value={form.kwaTarakimu} onChange={handleChange} /><label>Kwa tarakimu (miezi)</label></div>
                <div className="input-box"><input type="text" name="kiasiRejeshoBilaMatatizo" placeholder=" " value={form.kiasiRejeshoBilaMatatizo} onChange={handleChange} /><label>Ni kiasi gani cha rejesho unaweza kulipa bila matatizo?</label></div>
                <div className="input-box full-width"><textarea name="malengoMkopo" placeholder=" " rows={2} value={form.malengoMkopo} onChange={handleChange}></textarea><label>Malengo ya Mkopo</label></div>
                <div className="input-box"><input type="text" name="chanzoMapato" placeholder=" " value={form.chanzoMapato} onChange={handleChange} /><label>Chanzo cha Mapato</label></div>
              </div>
            )}

            {/* ========== SEHEMU 5: HISTORIA YA MIKOPO ========== */}
            {currentStep === 4 && (
              <div className="form-grid-4cols">
                <h4 style={{ gridColumn: "1/-1", color: "#22d3ee", margin: "10px 0 5px 0" }}>📌 Mkopo #1</h4>
                <div className="input-box"><input type="text" name="historia1JinaTaasisi" placeholder=" " value={form.historia1JinaTaasisi} onChange={handleChange} /><label>Jina la Taasisi</label></div>
                <div className="input-box"><input type="text" name="historia1UlichukuaLini" placeholder=" " value={form.historia1UlichukuaLini} onChange={handleChange} /><label>Ulichukua Mkopo lini</label></div>
                <div className="input-box"><input type="text" name="historia1KiasiMkopo" placeholder=" " value={form.historia1KiasiMkopo} onChange={handleChange} /><label>Kiasi cha mkopo</label></div>
                <div className="input-box"><input type="text" name="historia1KiasiMarejesho" placeholder=" " value={form.historia1KiasiMarejesho} onChange={handleChange} /><label>Kiasi cha marejesho</label></div>
                <div className="input-box"><input type="text" name="historia1TareheMarejesho" placeholder=" " value={form.historia1TareheMarejesho} onChange={handleChange} /><label>Tarehe za marejesho</label></div>
                <div className="input-box"><input type="text" name="historia1KiasiKilichobaki" placeholder=" " value={form.historia1KiasiKilichobaki} onChange={handleChange} /><label>Kiasi kilichobaki</label></div>
                
                <h4 style={{ gridColumn: "1/-1", color: "#22d3ee", margin: "10px 0 5px 0" }}>📌 Mkopo #2</h4>
                <div className="input-box"><input type="text" name="historia2JinaTaasisi" placeholder=" " value={form.historia2JinaTaasisi} onChange={handleChange} /><label>Jina la Taasisi</label></div>
                <div className="input-box"><input type="text" name="historia2UlichukuaLini" placeholder=" " value={form.historia2UlichukuaLini} onChange={handleChange} /><label>Ulichukua Mkopo lini</label></div>
                <div className="input-box"><input type="text" name="historia2KiasiMkopo" placeholder=" " value={form.historia2KiasiMkopo} onChange={handleChange} /><label>Kiasi cha mkopo</label></div>
                <div className="input-box"><input type="text" name="historia2KiasiMarejesho" placeholder=" " value={form.historia2KiasiMarejesho} onChange={handleChange} /><label>Kiasi cha marejesho</label></div>
                <div className="input-box"><input type="text" name="historia2TareheMarejesho" placeholder=" " value={form.historia2TareheMarejesho} onChange={handleChange} /><label>Tarehe za marejesho</label></div>
                <div className="input-box"><input type="text" name="historia2KiasiKilichobaki" placeholder=" " value={form.historia2KiasiKilichobaki} onChange={handleChange} /><label>Kiasi kilichobaki</label></div>
                
                <h4 style={{ gridColumn: "1/-1", color: "#22d3ee", margin: "10px 0 5px 0" }}>📌 Mkopo #3</h4>
                <div className="input-box"><input type="text" name="historia3JinaTaasisi" placeholder=" " value={form.historia3JinaTaasisi} onChange={handleChange} /><label>Jina la Taasisi</label></div>
                <div className="input-box"><input type="text" name="historia3UlichukuaLini" placeholder=" " value={form.historia3UlichukuaLini} onChange={handleChange} /><label>Ulichukua Mkopo lini</label></div>
                <div className="input-box"><input type="text" name="historia3KiasiMkopo" placeholder=" " value={form.historia3KiasiMkopo} onChange={handleChange} /><label>Kiasi cha mkopo</label></div>
                <div className="input-box"><input type="text" name="historia3KiasiMarejesho" placeholder=" " value={form.historia3KiasiMarejesho} onChange={handleChange} /><label>Kiasi cha marejesho</label></div>
                <div className="input-box"><input type="text" name="historia3TareheMarejesho" placeholder=" " value={form.historia3TareheMarejesho} onChange={handleChange} /><label>Tarehe za marejesho</label></div>
                <div className="input-box"><input type="text" name="historia3KiasiKilichobaki" placeholder=" " value={form.historia3KiasiKilichobaki} onChange={handleChange} /><label>Kiasi kilichobaki</label></div>
              </div>
            )}

            {/* ========== SEHEMU 6: DHAMANA YA MKOPO ========== */}
            {currentStep === 5 && (
              <div className="form-grid-4cols">
                <div className="input-box"><input type="text" name="dhamanaAina" placeholder=" " value={form.dhamanaAina} onChange={handleChange} /><label>Aina ya dhamana</label></div>
                <div className="input-box"><input type="text" name="dhamanaNambaUsajili" placeholder=" " value={form.dhamanaNambaUsajili} onChange={handleChange} /><label>Namba za usajili</label></div>
                <div className="input-box"><input type="text" name="dhamanaUmiliki" placeholder=" " value={form.dhamanaUmiliki} onChange={handleChange} /><label>Umiliki</label></div>
                <div className="input-box"><input type="text" name="dhamanaThamaniKwaSasa" placeholder=" " value={form.dhamanaThamaniKwaSasa} onChange={handleChange} /><label>Thamani yake kwa sasa</label></div>
                <div className="input-box"><select name="dhamanaMuonekano" value={form.dhamanaMuonekano} onChange={handleChange}><option value="">Chagua</option><option>Nzuri sana</option><option>Nzuri</option><option>Kuridhisha</option><option>Inahitaji matengenezo</option></select><label>Muonekano wa dhamana</label></div>
              </div>
            )}

            {/* ========== SEHEMU 7: WADHAMINI NO. 1 ========== */}
            {currentStep === 6 && (
              <div className="form-grid-4cols">
                <h4 style={{ gridColumn: "1/-1", color: "#22d3ee", margin: "5px 0" }}>MDHAMINI NO. 1</h4>
                <div className="input-box"><input type="text" name="wdhamini1JinaKamili" placeholder=" " value={form.wdhamini1JinaKamili} onChange={handleChange} /><label>Jina kamili la Mdhamini</label></div>
                <div className="input-box"><input type="text" name="wdhamini1MahaliAnapoishi" placeholder=" " value={form.wdhamini1MahaliAnapoishi} onChange={handleChange} /><label>Mahali Anapoishi</label></div>
                <div className="input-box"><select name="wdhamini1AmepangaKwake" value={form.wdhamini1AmepangaKwake} onChange={handleChange}><option value="">Chagua</option><option>Amepanga</option><option>Kwake</option></select><label>Amepanga/ kwake</label></div>
                <div className="input-box"><input type="text" name="wdhamini1NambaNyumba" placeholder=" " value={form.wdhamini1NambaNyumba} onChange={handleChange} /><label>Namba ya nyumba</label></div>
                <div className="input-box"><input type="text" name="wdhamini1KaziAnayofanya" placeholder=" " value={form.wdhamini1KaziAnayofanya} onChange={handleChange} /><label>Kazi Anayofanya</label></div>
                <div className="input-box"><input type="text" name="wdhamini1UhusianoWenu" placeholder=" " value={form.wdhamini1UhusianoWenu} onChange={handleChange} /><label>Uhusiano wenu</label></div>
                <div className="input-box"><input type="text" name="wdhamini1MahaliOfisiYake" placeholder=" " value={form.wdhamini1MahaliOfisiYake} onChange={handleChange} /><label>Mahali ilipo Ofisi yake</label></div>
                <div className="input-box"><input type="text" name="wdhamini1JinaKampuniBiashara" placeholder=" " value={form.wdhamini1JinaKampuniBiashara} onChange={handleChange} /><label>Jina la kampuni/ biashara</label></div>
                <div className="input-box"><input type="tel" name="wdhamini1Simu" placeholder=" " value={form.wdhamini1Simu} onChange={handleChange} /><label>Simu</label></div>
              </div>
            )}

            {/* ========== SEHEMU 7: WADHAMINI NO. 2 ========== */}
            {currentStep === 7 && (
              <div className="form-grid-4cols">
                <h4 style={{ gridColumn: "1/-1", color: "#22d3ee", margin: "5px 0" }}>MDHAMINI NO. 2</h4>
                <div className="input-box"><input type="text" name="wdhamini2JinaKamili" placeholder=" " value={form.wdhamini2JinaKamili} onChange={handleChange} /><label>Jina kamili la Mdhamini</label></div>
                <div className="input-box"><input type="text" name="wdhamini2MahaliAnapoishi" placeholder=" " value={form.wdhamini2MahaliAnapoishi} onChange={handleChange} /><label>Mahali Anapoishi</label></div>
                <div className="input-box"><select name="wdhamini2AmepangaKwake" value={form.wdhamini2AmepangaKwake} onChange={handleChange}><option value="">Chagua</option><option>Amepanga</option><option>Kwake</option></select><label>Amepanga/ kwake</label></div>
                <div className="input-box"><input type="text" name="wdhamini2NambaNyumba" placeholder=" " value={form.wdhamini2NambaNyumba} onChange={handleChange} /><label>Namba ya nyumba</label></div>
                <div className="input-box"><input type="text" name="wdhamini2KaziAnayofanya" placeholder=" " value={form.wdhamini2KaziAnayofanya} onChange={handleChange} /><label>Kazi Anayofanya</label></div>
                <div className="input-box"><input type="text" name="wdhamini2UhusianoWenu" placeholder=" " value={form.wdhamini2UhusianoWenu} onChange={handleChange} /><label>Uhusiano wenu</label></div>
                <div className="input-box"><input type="text" name="wdhamini2MahaliOfisiYake" placeholder=" " value={form.wdhamini2MahaliOfisiYake} onChange={handleChange} /><label>Mahali ilipo Ofisi yake</label></div>
                <div className="input-box"><input type="text" name="wdhamini2JinaKampuniBiashara" placeholder=" " value={form.wdhamini2JinaKampuniBiashara} onChange={handleChange} /><label>Jina la kampuni/ biashara</label></div>
                <div className="input-box"><input type="tel" name="wdhamini2Simu" placeholder=" " value={form.wdhamini2Simu} onChange={handleChange} /><label>Simu</label></div>
              </div>
            )}

            {/* ========== TAMKO NA WASILISHA ========== */}
            {currentStep === 8 && (
              <div className="tamko-container">
                <div className="tamko-card">
                  <p><strong>Mimi</strong> nimeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa hapo juu ni sahihi kadiri ya ufahamu wangu. Nakubali kutembelewa na Afisa mikopo sehemu ya biashara yangu na nyumbani kwangu na kupata taarifa muhimu kutoka kwa watu wengine kwa ajili ya uhakiki wa taarifa zangu. Pia kwa kujaza fomu hii natoa ridhaa kwa mkopeshaji kutoa taarifa zangu kwenye Taasisi za Kuchakata Taarifa za Wakopaji (CRB) na wadau wengine.</p>
                  <label><input type="checkbox" name="tamkoMwombaji" checked={form.tamkoMwombaji} onChange={handleChange} /> Ninakubali tamko la mwombaji (Sahihi/Tarehe/Dole Gumba)</label>
                </div>
                <div className="tamko-card">
                  <p><strong>Mdhamini 1:</strong> Ninakubali kumdhamini aliyeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa ni sahihi. Natambua kuwa nitawajibika kulipa mkopo huu kama ikitokea mwombaji ameshindwa kulipa kwa wakati sawa sawa na mkataba wa mkopo huu.</p>
                  <label><input type="checkbox" name="tamkoMdhamini1" checked={form.tamkoMdhamini1} onChange={handleChange} /> Ninakubali tamko la Mdhamini 1 (Sahihi/Tarehe/Dole Gumba)</label>
                </div>
                <div className="tamko-card">
                  <p><strong>Mdhamini 2:</strong> Ninakubali kumdhamini aliyeomba mkopo wa Tsh kutoka Orethan Microfinance. Nakiri kwamba taarifa zote nilizozitoa ni sahihi. Natambua kuwa nitawajibika kulipa mkopo huu kama ikitokea mwombaji ameshindwa kulipa kwa wakati sawa sawa na mkataba wa mkopo huu.</p>
                  <label><input type="checkbox" name="tamkoMdhamini2" checked={form.tamkoMdhamini2} onChange={handleChange} /> Ninakubali tamko la Mdhamini 2 (Sahihi/Tarehe/Dole Gumba)</label>
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
        .tamko-card label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 13px; }
        
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

export default PersonalLoan;