import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

function PersonalLoan() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [passportPhoto, setPassportPhoto] = useState<File | null>(null);

  const [form, setForm] = useState({
    fomuNo: "",
    jinaKamiliLaMwombaji: "",
    jinsia: "",
    jinaMaarufu: "",
    tareheYaKuzaliwa: "",
    ainaYaKitambulisho: "",
    nambaYaKitambulisho: "",
    nambaYaSimu: "",
    baruaPepe: "",
    uraia: "",
    haliYaNdoa: "",
    mahaliUnapoishiMkoa: "",
    mahaliUnapoishiWilaya: "",
    mahaliUnapoishiKata: "",
    mahaliUnapoishiMtaa: "",
    umilikiWaMakazi: "",
    umilikiWaMakaziMengine: "",
    nambaYaNyumba: "",
    umepanga: "",
    umeishiHapoTanguMiezi: "",
    jinaKamiliLaMumeMke: "",
    simuYaMumeMke: "",
    jinaMaarufuMtaani: "",
    ainaYaKitambulishoMumeMke: "",
    nambaYaKitambulishoMumeMke: "",
    kaziYaMumeMke: "",
    jinaLaMwajiriWaMumeMke: "",
    simuYaOfisiYaMumeMke: "",

    // SEHEMU 2: TAARIFA ZA AJIRA (UOMBIAJI)
    jinaLaKampuniYaMwajiri: "",
    anuaniYaOfisiYaMwajiri: "",
    wadhifa: "",
    tareheYaKuanzaKazi: "",
    mshaharaKwaMwezi: "",
    ainaYaAjira: "",
    tareheYaKumalizaMkataba: "",
    tareheYaKustaafu: "",

    // SEHEMU 3: TAARIFA ZA BIASHARA
    jinaLaBiashara: "",
    ainaYaBiashara: "",
    mahaliBiasharaIlipo: "",
    umfanyaBiasharaTanguLini: "",
    jinaMmilikiEneoBiashara: "",
    nambaSimuMmilikiEneo: "",
    wastaniKipatoKwaMwezi: "",
    mudaMkatabaEneoBiashara: "",
    wastaniMatumiziKwaMwezi: "",
    kiasiMkopo: "",
    kwaManeno: "",
    mudaKulipaMkopo: "",
    kwaTarakimu: "",
    kiasiRejeshoBilaMatatizo: "",
    malengoMkopo: "",
    chanzoMapato: "",
    historia1JinaTaasisi: "", historia1UlichukuaLini: "", historia1KiasiMkopo: "", historia1KiasiMarejesho: "", historia1TareheMarejesho: "", historia1KiasiKilichobaki: "",
    historia2JinaTaasisi: "", historia2UlichukuaLini: "", historia2KiasiMkopo: "", historia2KiasiMarejesho: "", historia2TareheMarejesho: "", historia2KiasiKilichobaki: "",
    historia3JinaTaasisi: "", historia3UlichukuaLini: "", historia3KiasiMkopo: "", historia3KiasiMarejesho: "", historia3TareheMarejesho: "", historia3KiasiKilichobaki: "",
    dhamanaAina: "", dhamanaNambaUsajili: "", dhamanaUmiliki: "", dhamanaThamaniKwaSasa: "", dhamanaMuonekano: "",
    wdhamini1JinaKamili: "", wdhamini1MahaliAnapoishi: "", wdhamini1AmepangaKwake: "", wdhamini1NambaNyumba: "", wdhamini1KaziAnayofanya: "", wdhamini1UhusianoWenu: "", wdhamini1MahaliOfisiYake: "", wdhamini1JinaKampuniBiashara: "", wdhamini1Simu: "",
    wdhamini2JinaKamili: "", wdhamini2MahaliAnapoishi: "", wdhamini2AmepangaKwake: "", wdhamini2NambaNyumba: "", wdhamini2KaziAnayofanya: "", wdhamini2UhusianoWenu: "", wdhamini2MahaliOfisiYake: "", wdhamini2JinaKampuniBiashara: "", wdhamini2Simu: "",
    tamkoLaMwombaji: false,
    mwombajiAmesainiFomuNgumu: false,
    mwombajiAmewekaDoleGumba: false,
    tamkoMdhamini1: false,
    mdhamini1AmesainiFomuNgumu: false,
    mdhamini1AmewekaDoleGumba: false,
    tamkoMdhamini2: false,
    mdhamini2AmesainiFomuNgumu: false,
    mdhamini2AmewekaDoleGumba: false,
  });

  const steps = [
    "1. TAARIFA ZA MWOMBAJI",
    "2. KAZI NA BIASHARA",
    "3. MKOPO NA HISTORIA",
    "4. DHAMANA NA WADHAMINI",
    "5. TAMKO NA WASILISHA"
  ];

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalTarget(document.getElementById("navbar-portal"));
  }, []);

  const uploadPassportPhoto = async (): Promise<string | null> => {
    if (!passportPhoto) return null;
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("photo", passportPhoto);
      formData.append("applicant_name", form.jinaKamiliLaMwombaji);
      const res = await axios.post("http://127.0.0.1:8000/api/v1/upload/passport", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: token ? `Bearer ${token}` : "" },
      });
      return res.data.photo_url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
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
    if (!form.tamkoLaMwombaji || !form.tamkoMdhamini1 || !form.tamkoMdhamini2) {
      alert("Tafadhali kubali tamko la mwombaji na wadhamini wote wawili");
      return;
    }
    if (!passportPhoto) {
      alert("Tafadhali pakia picha yako ya passport");
      return;
    }

    try {
      setLoading(true);
      let photoUrl = await uploadPassportPhoto() || "";
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:8000/api/v1/loans", {
        name: form.jinaKamiliLaMwombaji,
        phone: form.nambaYaSimu,
        amount: form.kiasiMkopo,
        type: "personal",
        passport_photo: photoUrl,
        details: { ...form, passportPhotoUrl: photoUrl },
      }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      alert("OMBI LA MKOPO LIMEWASILISHWA KWA MAFANIKIO!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Imeshindwa kuwasilisha ombi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {portalTarget && createPortal(
        <div className="form-portal-content">
          <div className="fomu-no">
            <span style={{ color: '#64748b' }}>Fomu No:</span>
            <input type="text" name="fomuNo" value={form.fomuNo} onChange={handleChange} placeholder="........" className="fomu-no-input" />
          </div>
          <div className="step-indicators">
            {steps.map((_, idx) => (
              <button key={idx} type="button" className={`step-btn ${idx === currentStep ? "active" : ""} ${idx < currentStep ? "completed" : ""}`} onClick={() => idx < currentStep && setCurrentStep(idx)}>
                {idx + 1}
              </button>
            ))}
          </div>
        </div>,
        portalTarget
      )}

      <div className="form-container">
        <div className="step-title">{steps[currentStep]}</div>

        <form onSubmit={handleSubmit}>
          <div className="form-scroll">

            {/* STEP 1: TAARIFA ZA MWOMBAJI */}
            {currentStep === 0 && (
              <div className="form-section">
                <div className="section-divider">SEHEMU 1: TAARIFA ZA MWOMBAJI</div>
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={4}><strong>Jina kamili la mwombaji</strong><br /><input type="text" name="jinaKamiliLaMwombaji" value={form.jinaKamiliLaMwombaji} onChange={handleChange} /></td>
                      <td colSpan={2}><strong>Jinsia</strong><br /><select name="jinsia" value={form.jinsia} onChange={handleChange}><option value="">Chagua</option><option value="Me">Me</option><option value="Ke">Ke</option></select></td>
                      <td colSpan={3}><strong>Jina maarufu</strong><br /><input type="text" name="jinaMaarufu" value={form.jinaMaarufu} onChange={handleChange} /></td>
                      <td colSpan={3}><strong>Tarehe ya kuzaliwa</strong><br /><input type="date" name="tareheYaKuzaliwa" value={form.tareheYaKuzaliwa} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Aina ya kitambulisho</strong><br /><select name="ainaYaKitambulisho" value={form.ainaYaKitambulisho} onChange={handleChange}><option value="">Chagua</option><option value="Kitambulisho cha Taifa">Kitambulisho cha Taifa</option><option value="Pasipoti">Pasipoti</option><option value="Leseni ya kuendesha">Leseni ya kuendesha</option></select></td>
                      <td colSpan={4}><strong>Namba ya kitambulisho</strong><br /><input type="text" name="nambaYaKitambulisho" value={form.nambaYaKitambulisho} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Namba ya simu</strong><br /><input type="tel" name="nambaYaSimu" value={form.nambaYaSimu} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Barua pepe (Email)</strong><br /><input type="email" name="baruaPepe" value={form.baruaPepe} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Uraia (Nationality)</strong><br /><input type="text" name="uraia" value={form.uraia} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Hali ya ndoa</strong><br /><select name="haliYaNdoa" value={form.haliYaNdoa} onChange={handleChange}><option value="">Chagua</option><option value="Nimeoa/Olewa">1. Nimeoa/Olewa</option><option value="Sijaoa/Olewa">2. Sijaoa/Olewa</option><option value="Nimeachika">3. Nimeachika</option><option value="Mjane">4. Mjane</option></select></td>
                    </tr>
                    <tr><td colSpan={12} className="sub-header" style={{ background: "#f0f0f0", fontWeight: "bold" }}>MAHALI UNAPOISHI KWA SASA</td></tr>
                    <tr>
                      <td colSpan={3}><strong>Mkoa</strong><br /><input type="text" name="mahaliUnapoishiMkoa" value={form.mahaliUnapoishiMkoa} onChange={handleChange} /></td>
                      <td colSpan={3}><strong>Wilaya</strong><br /><input type="text" name="mahaliUnapoishiWilaya" value={form.mahaliUnapoishiWilaya} onChange={handleChange} /></td>
                      <td colSpan={3}><strong>Kata</strong><br /><input type="text" name="mahaliUnapoishiKata" value={form.mahaliUnapoishiKata} onChange={handleChange} /></td>
                      <td colSpan={3}><strong>Mtaa</strong><br /><input type="text" name="mahaliUnapoishiMtaa" value={form.mahaliUnapoishiMtaa} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Umiliki wa makazi</strong><br />
                        <select name="umilikiWaMakazi" value={form.umilikiWaMakazi} onChange={handleChange}>
                          <option value="">Chagua</option><option value="Kwake">Kwake</option><option value="Mengine">Mengine (eleza)</option>
                        </select>
                        {form.umilikiWaMakazi === "Mengine" && <input type="text" name="umilikiWaMakaziMengine" value={form.umilikiWaMakaziMengine} onChange={handleChange} style={{ marginTop: "5px" }} placeholder="Eleza hapa..." />}
                      </td>
                      <td colSpan={3}><strong>Namba ya nyumba</strong><br /><input type="text" name="nambaYaNyumba" value={form.nambaYaNyumba} onChange={handleChange} /></td>
                      <td colSpan={2}><strong>Umepanga</strong><br /><select name="umepanga" value={form.umepanga} onChange={handleChange}><option value="">Chagua</option><option value="Ndio">Ndio</option><option value="Hapana">Hapana</option></select></td>
                      <td colSpan={3}><strong>Umeishi hapo tangu (miezi)</strong><br /><input type="text" name="umeishiHapoTanguMiezi" value={form.umeishiHapoTanguMiezi} onChange={handleChange} /></td>
                    </tr>
                    <tr><td colSpan={12} className="sub-header" style={{ background: "#f0f0f0", fontWeight: "bold" }}>TAARIFA ZA MUME/MKE</td></tr>
                    <tr>
                      <td colSpan={4}><strong>Jina kamili la mume/mke</strong><br /><input type="text" name="jinaKamiliLaMumeMke" value={form.jinaKamiliLaMumeMke} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Simu</strong><br /><input type="tel" name="simuYaMumeMke" value={form.simuYaMumeMke} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Jina maarufu mtaani</strong><br /><input type="text" name="jinaMaarufuMtaani" value={form.jinaMaarufuMtaani} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={4}><strong>Aina ya kitambulisho</strong><br /><select name="ainaYaKitambulishoMumeMke" value={form.ainaYaKitambulishoMumeMke} onChange={handleChange}><option value="">Chagua</option><option value="Kitambulisho cha Taifa">Kitambulisho cha Taifa</option><option value="Pasipoti">Pasipoti</option></select></td>
                      <td colSpan={4}><strong>Namba ya kitambulisho</strong><br /><input type="text" name="nambaYaKitambulishoMumeMke" value={form.nambaYaKitambulishoMumeMke} onChange={handleChange} /></td>
                      <td colSpan={4}><strong>Kazi anayofanya</strong><br /><input type="text" name="kaziYaMumeMke" value={form.kaziYaMumeMke} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Jina la mwajiri</strong><br /><input type="text" name="jinaLaMwajiriWaMumeMke" value={form.jinaLaMwajiriWaMumeMke} onChange={handleChange} /></td>
                      <td colSpan={6}><strong>Simu ya ofisi</strong><br /><input type="tel" name="simuYaOfisiYaMumeMke" value={form.simuYaOfisiYaMumeMke} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* STEP 2: KAZI NA BIASHARA */}
            {currentStep === 1 && (
              <div className="form-section">
                {/* SEHEMU 2: AJIRA */}
                <div className="section-divider">SEHEMU 2: TAARIFA ZA AJIRA</div>
                <table className="form-table">
                  <tbody>
                    <tr>
                      <td colSpan={6}><strong>Jina la kampuni/mwajiri</strong><br /><input type="text" name="jinaLaKampuniYaMwajiri" value={form.jinaLaKampuniYaMwajiri} onChange={handleChange} /></td>
                      <td colSpan={6}><strong>Anuani ya ofisi ya mwajiri</strong><br /><input type="text" name="anuaniYaOfisiYaMwajiri" value={form.anuaniYaOfisiYaMwajiri} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Wadhifa wako</strong><br /><input type="text" name="wadhifa" value={form.wadhifa} onChange={handleChange} /></td>
                      <td colSpan={6}><strong>Umefanya kazi hapo toka lini</strong><br /><input type="text" name="tareheYaKuanzaKazi" value={form.tareheYaKuanzaKazi} onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Mshahara kwa mwezi (Tsh)</strong><br /><input type="number" name="mshaharaKwaMwezi" value={form.mshaharaKwaMwezi} onChange={handleChange} /></td>
                      <td colSpan={6}><strong>Aina ya ajira</strong><br /><select name="ainaYaAjira" value={form.ainaYaAjira} onChange={handleChange}><option value="">Chagua</option><option value="Kudumu">Kudumu</option><option value="Mkataba">Mkataba</option><option value="Ya muda mfupi">Ya muda mfupi</option></select></td>
                    </tr>
                    <tr>
                      <td colSpan={6}><strong>Tarehe ya kumaliza mkataba</strong><br /><input type="date" name="tareheYaKumalizaMkataba" value={form.tareheYaKumalizaMkataba} onChange={handleChange} /></td>
                      <td colSpan={6}><strong>Tarehe ya kustaafu</strong><br /><input type="date" name="tareheYaKustaafu" value={form.tareheYaKustaafu} onChange={handleChange} /></td>
                    </tr>
                  </tbody>
                </table>

                {/* SEHEMU 3: BIASHARA */}
                <div className="section-divider" style={{ marginTop: '40px' }}>SEHEMU 3: TAARIFA ZA BIASHARA</div>
                <table className="form-table">
                  <tbody>
                    <tr><td colSpan={6}><strong>Jina la Biashara</strong></td><td colSpan={6}><strong>Aina ya Biashara</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="jinaLaBiashara" value={form.jinaLaBiashara} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="ainaYaBiashara" value={form.ainaYaBiashara} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={12}><strong>Mahali Biashara Ilipo</strong></td></tr>
                    <tr><td colSpan={12}><input type="text" name="mahaliBiasharaIlipo" value={form.mahaliBiasharaIlipo} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Umfanya Biashara hii tangu lini</strong></td><td colSpan={6}><strong>Jina la mmiliki wa eneo la biashara</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="umfanyaBiasharaTanguLini" value={form.umfanyaBiasharaTanguLini} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="jinaMmilikiEneoBiashara" value={form.jinaMmilikiEneoBiashara} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Namba zake za simu</strong></td><td colSpan={6}><strong>Wastani wa kipato kwa mwezi</strong></td></tr>
                    <tr><td colSpan={6}><input type="tel" name="nambaSimuMmilikiEneo" value={form.nambaSimuMmilikiEneo} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="wastaniKipatoKwaMwezi" value={form.wastaniKipatoKwaMwezi} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Muda wa mkataba wa eneo la biashara</strong></td><td colSpan={6}><strong>Wastani wa matumizi kwa mwezi</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="mudaMkatabaEneoBiashara" value={form.mudaMkatabaEneoBiashara} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="wastaniMatumiziKwaMwezi" value={form.wastaniMatumiziKwaMwezi} onChange={handleChange} /></td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* STEP 3: MKOPO NA HISTORIA */}
            {currentStep === 2 && (
              <div className="form-section">
                {/* SEHEMU 4: KIASI */}
                <div className="section-divider">SEHEMU 4: KIASI CHA MKOPO NA MALENGO</div>
                <table className="form-table">
                  <tbody>
                    <tr><td colSpan={6}><strong>Kiasi cha Mkopo (Tsh)</strong></td><td colSpan={6}><strong>Kwa maneno</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="kiasiMkopo" value={form.kiasiMkopo} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="kwaManeno" value={form.kwaManeno} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Muda wa kulipa Mkopo</strong></td><td colSpan={6}><strong>Kwa tarakimu</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="mudaKulipaMkopo" value={form.mudaKulipaMkopo} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="kwaTarakimu" value={form.kwaTarakimu} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={12}><strong>Ni kiasi gani cha rejesho unaweza kulipa bila matatizo?</strong></td></tr>
                    <tr><td colSpan={12}><input type="text" name="kiasiRejeshoBilaMatatizo" value={form.kiasiRejeshoBilaMatatizo} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={12}><strong>Malengo ya Mkopo</strong></td></tr>
                    <tr><td colSpan={12}><textarea name="malengoMkopo" rows={3} value={form.malengoMkopo} onChange={handleChange}></textarea></td></tr>
                    <tr><td colSpan={12}><strong>Chanzo cha Mapato</strong></td></tr>
                    <tr><td colSpan={12}><input type="text" name="chanzoMapato" value={form.chanzoMapato} onChange={handleChange} /></td></tr>
                  </tbody>
                </table>

                {/* SEHEMU 5: HISTORIA */}
                <div className="section-divider" style={{ marginTop: '40px' }}>SEHEMU 5: HISTORIA YA MIKOPO</div>
                <table className="form-table history-table">
                  <thead>
                    <tr><th>Jina la Taasisi</th><th>Lini</th><th>Kiasi</th><th>Rejesho</th><th>Tarehe</th><th>Baki</th></tr>
                  </thead>
                  <tbody>
                    <tr><td><input type="text" name="historia1JinaTaasisi" value={form.historia1JinaTaasisi} onChange={handleChange} /></td><td><input type="text" name="historia1UlichukuaLini" value={form.historia1UlichukuaLini} onChange={handleChange} /></td><td><input type="text" name="historia1KiasiMkopo" value={form.historia1KiasiMkopo} onChange={handleChange} /></td><td><input type="text" name="historia1KiasiMarejesho" value={form.historia1KiasiMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia1TareheMarejesho" value={form.historia1TareheMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia1KiasiKilichobaki" value={form.historia1KiasiKilichobaki} onChange={handleChange} /></td></tr>
                    <tr><td><input type="text" name="historia2JinaTaasisi" value={form.historia2JinaTaasisi} onChange={handleChange} /></td><td><input type="text" name="historia2UlichukuaLini" value={form.historia2UlichukuaLini} onChange={handleChange} /></td><td><input type="text" name="historia2KiasiMkopo" value={form.historia2KiasiMkopo} onChange={handleChange} /></td><td><input type="text" name="historia2KiasiMarejesho" value={form.historia2KiasiMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia2TareheMarejesho" value={form.historia2TareheMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia2KiasiKilichobaki" value={form.historia2KiasiKilichobaki} onChange={handleChange} /></td></tr>
                    <tr><td><input type="text" name="historia3JinaTaasisi" value={form.historia3JinaTaasisi} onChange={handleChange} /></td><td><input type="text" name="historia3UlichukuaLini" value={form.historia3UlichukuaLini} onChange={handleChange} /></td><td><input type="text" name="historia3KiasiMkopo" value={form.historia3KiasiMkopo} onChange={handleChange} /></td><td><input type="text" name="historia3KiasiMarejesho" value={form.historia3KiasiMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia3TareheMarejesho" value={form.historia3TareheMarejesho} onChange={handleChange} /></td><td><input type="text" name="historia3KiasiKilichobaki" value={form.historia3KiasiKilichobaki} onChange={handleChange} /></td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* STEP 4: DHAMANA NA WADHAMINI */}
            {currentStep === 3 && (
              <div className="form-section">
                {/* SEHEMU 6: DHAMANA */}
                <div className="section-divider">SEHEMU 6: DHAMANA YA MKOPO</div>
                <table className="form-table">
                  <tbody>
                    <tr><td colSpan={6}><strong>Aina ya dhamana</strong></td><td colSpan={6}><strong>Namba za usajili</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="dhamanaAina" value={form.dhamanaAina} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="dhamanaNambaUsajili" value={form.dhamanaNambaUsajili} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={6}><strong>Umiliki</strong></td><td colSpan={6}><strong>Thamani yake kwa sasa</strong></td></tr>
                    <tr><td colSpan={6}><input type="text" name="dhamanaUmiliki" value={form.dhamanaUmiliki} onChange={handleChange} /></td><td colSpan={6}><input type="text" name="dhamanaThamaniKwaSasa" value={form.dhamanaThamaniKwaSasa} onChange={handleChange} /></td></tr>
                    <tr><td colSpan={12}><strong>Muonekano wa dhamana</strong></td></tr>
                    <tr><td colSpan={12}><select name="dhamanaMuonekano" value={form.dhamanaMuonekano} onChange={handleChange}><option value="">Chagua</option><option>Nzuri sana</option><option>Nzuri</option><option>Kuridhisha</option><option>Inahitaji matengenezo</option></select></td></tr>
                  </tbody>
                </table>

                {/* SEHEMU 7: WADHAMINI */}
                <div className="section-divider" style={{ marginTop: '40px' }}>SEHEMU 7: WADHAMINI (NO.1 & NO.2)</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* Guarantor 1 */}
                  <div style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', background: '#f8fafc' }}>
                    <p style={{ fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>MDHAMINI NO. 1</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label>Jina kamili<br /><input type="text" name="wdhamini1JinaKamili" value={form.wdhamini1JinaKamili} onChange={handleChange} /></label>
                      <label>Mahali Anapoishi<br /><input type="text" name="wdhamini1MahaliAnapoishi" value={form.wdhamini1MahaliAnapoishi} onChange={handleChange} /></label>
                      <label>Amepanga/Kwake<br /><select name="wdhamini1AmepangaKwake" value={form.wdhamini1AmepangaKwake} onChange={handleChange}><option value="">Chagua</option><option>Amepanga</option><option>Kwake</option></select></label>
                      <label>Kazi / Uhusiano<br />
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <input type="text" name="wdhamini1KaziAnayofanya" placeholder="Kazi" value={form.wdhamini1KaziAnayofanya} onChange={handleChange} />
                          <input type="text" name="wdhamini1UhusianoWenu" placeholder="Uhusiano" value={form.wdhamini1UhusianoWenu} onChange={handleChange} />
                        </div>
                      </label>
                      <label>Simu<br /><input type="tel" name="wdhamini1Simu" value={form.wdhamini1Simu} onChange={handleChange} /></label>
                    </div>
                  </div>
                  {/* Guarantor 2 */}
                  <div style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', background: '#f8fafc' }}>
                    <p style={{ fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>MDHAMINI NO. 2</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label>Jina kamili<br /><input type="text" name="wdhamini2JinaKamili" value={form.wdhamini2JinaKamili} onChange={handleChange} /></label>
                      <label>Mahali Anapoishi<br /><input type="text" name="wdhamini2MahaliAnapoishi" value={form.wdhamini2MahaliAnapoishi} onChange={handleChange} /></label>
                      <label>Amepanga/Kwake<br /><select name="wdhamini2AmepangaKwake" value={form.wdhamini2AmepangaKwake} onChange={handleChange}><option value="">Chagua</option><option>Amepanga</option><option>Kwake</option></select></label>
                      <label>Kazi / Uhusiano<br />
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <input type="text" name="wdhamini2KaziAnayofanya" placeholder="Kazi" value={form.wdhamini2KaziAnayofanya} onChange={handleChange} />
                          <input type="text" name="wdhamini2UhusianoWenu" placeholder="Uhusiano" value={form.wdhamini2UhusianoWenu} onChange={handleChange} />
                        </div>
                      </label>
                      <label>Simu<br /><input type="tel" name="wdhamini2Simu" value={form.wdhamini2Simu} onChange={handleChange} /></label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: TAMKO NA WASILISHA */}
            {currentStep === 4 && (
              <div className="form-section">
                <div className="section-divider">TAMKO, PASSPORT NA WASILISHA</div>

                <div className="tamko-content">
                  {/* Passport Upload First in this step */}
                  <div className="tamko-card" style={{ borderLeftColor: '#10b981' }}>
                    <p><strong>PAKIA PICHA YA PASSPORT</strong></p>
                    <div className="passport-upload">
                      <div className="passport-preview">
                        {passportPhoto ? (
                          <img src={URL.createObjectURL(passportPhoto)} alt="Preview" />
                        ) : (
                          <div className="preview-placeholder">View Photo</div>
                        )}
                      </div>
                      <div className="upload-controls">
                        <label className="upload-btn">
                          CHAGUA PICHA
                          <input type="file" hidden accept="image/*" onChange={(e) => setPassportPhoto(e.target.files?.[0] || null)} />
                        </label>
                        <p className="upload-note">Picha ya passport inahitajika kwa ajili ya utambulisho wako kwenye mfumo.</p>
                      </div>
                    </div>
                  </div>

                  <div className="tamko-card">
                    <p><strong>TAMKO LA MWOMBAJI</strong> (Mkopaji: {form.jinaKamiliLaMwombaji || "..."})</p>
                    <p>Mimi nathibitisha kuwa taarifa zote nilizozitoa ni za kweli. Nakubali kutembelewa na Afisa kwa uhakiki na kutoa ridhaa ya taarifa zangu kuwekwa CRB.</p>
                    <div className="tamko-checkbox-group">
                      <label className="checkbox-label"><input type="checkbox" name="mwombajiAmesainiFomuNgumu" checked={form.mwombajiAmesainiFomuNgumu} onChange={handleChange} /> Mwombaji amesaini fomu ngumu?</label>
                      <label className="checkbox-label"><input type="checkbox" name="mwombajiAmewekaDoleGumba" checked={form.mwombajiAmewekaDoleGumba} onChange={handleChange} /> Mwombaji ameweka dole gumba?</label>
                      <label className="checkbox-label" style={{ background: '#eff6ff', borderColor: '#3b82f6' }}><input type="checkbox" name="tamkoLaMwombaji" checked={form.tamkoLaMwombaji} onChange={handleChange} /> Nimeisoma na nakubaliana na vigezo vyote</label>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="tamko-card">
                      <p><strong>TAMKO LA MDHAMINI 1</strong></p>
                      <div className="tamko-checkbox-group">
                        <label className="checkbox-label"><input type="checkbox" name="mdhamini1AmesainiFomuNgumu" checked={form.mdhamini1AmesainiFomuNgumu} onChange={handleChange} /> Mdhamini 1 amesaini?</label>
                        <label className="checkbox-label"><input type="checkbox" name="mdhamini1AmewekaDoleGumba" checked={form.mdhamini1AmewekaDoleGumba} onChange={handleChange} /> Mdhamini 1 dole gumba?</label>
                        <label className="checkbox-label" style={{ background: '#ecfdf5' }}><input type="checkbox" name="tamkoMdhamini1" checked={form.tamkoMdhamini1} onChange={handleChange} /> Nakubali udhamini huu</label>
                      </div>
                    </div>
                    <div className="tamko-card">
                      <p><strong>TAMKO LA MDHAMINI 2</strong></p>
                      <div className="tamko-checkbox-group">
                        <label className="checkbox-label"><input type="checkbox" name="mdhamini2AmesainiFomuNgumu" checked={form.mdhamini2AmesainiFomuNgumu} onChange={handleChange} /> Mdhamini 2 amesaini?</label>
                        <label className="checkbox-label"><input type="checkbox" name="mdhamini2AmewekaDoleGumba" checked={form.mdhamini2AmewekaDoleGumba} onChange={handleChange} /> Mdhamini 2 dole gumba?</label>
                        <label className="checkbox-label" style={{ background: '#ecfdf5' }}><input type="checkbox" name="tamkoMdhamini2" checked={form.tamkoMdhamini2} onChange={handleChange} /> Nakubali udhamini huu</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="nav-buttons">
            {currentStep > 0 && (
              <button type="button" className="btn-prev" onClick={prevStep}>◄ NYUMA</button>
            )}
            {currentStep < steps.length - 1 ? (
              <button type="button" className="btn-next" onClick={nextStep}>ENDELEA ►</button>
            ) : (
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "INAWASILISHA..." : "WASILISHA OMBI"}
              </button>
            )}
          </div>
        </form>
      </div>

      <style>{`
        .page-container {
          background: #e8f0fe;
          padding: 16px;
          margin-top: -24px;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          font-family: 'Inter', sans-serif;
        }
        .form-container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .form-portal-content { display: flex; align-items: center; gap: 24px; }
        .fomu-no { font-size: 14px; font-weight: 600; color: #0f172a; display: flex; align-items: center; }
        .fomu-no-input { width: 120px; padding: 6px 10px; margin-left: 8px; border: 1px solid #cbd5e1; border-radius: 6px; }
        .step-indicators { display: flex; gap: 10px; }
        .step-btn {
          width: 34px; height: 34px; border-radius: 50%; border: 2px solid #e2e8f0;
          background: white; color: #64748b; cursor: pointer; font-weight: 700;
          display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .step-btn.completed { background: #10b981; color: white; border-color: #10b981; }
        .step-btn.active { background: #102a43; color: white; border-color: #102a43; transform: scale(1.1); box-shadow: 0 4px 10px rgba(16, 42, 67, 0.2); }
        
        .step-title { background: #f8fafc; padding: 12px 24px; font-weight: 800; color: #1e293b; border-bottom: 2px solid #e2e8f0; }
        .form-scroll { padding: 30px; max-height: calc(100vh - 280px); overflow-y: auto; }
        
        .section-divider {
          background: #102a43; color: white; padding: 10px 18px; border-radius: 6px;
          font-weight: 700; font-size: 14px; margin-bottom: 20px;
        }
        .form-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .form-table td { border: 1px solid #e2e8f0; padding: 12px; vertical-align: top; }
        .form-table strong { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .form-table input, .form-table select, .form-table textarea {
          width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px;
          font-size: 14px; margin-top: 6px; transition: border-color 0.2s;
        }
        .form-table input:focus { border-color: #3b82f6; outline: none; }
        
        .history-table th { background: #f1f5f9; padding: 10px; font-size: 11px; text-align: left; }
        .tamko-card { background: #fff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; border-left: 5px solid #3b82f6; }
        .tamko-checkbox-group { display: flex; flexDirection: column; gap: 10px; margin-top: 15px; }
        .checkbox-label {
          display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 13px; font-weight: 600;
          padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc;
        }
        
        .passport-upload { display: flex; gap: 20px; align-items: center; margin-top: 10px; }
        .passport-preview { width: 100px; height: 120px; border: 2px dashed #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .passport-preview img { width: 100%; height: 100%; object-fit: cover; }
        .upload-btn { background: #102a43; color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; }

        .nav-buttons { padding: 20px 30px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; gap: 20px; }
        .btn-prev { flex: 1; padding: 14px; background: #94a3b8; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
        .btn-next { flex: 1; padding: 14px; background: #102a43; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
        .btn-submit { flex: 1; padding: 14px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
        
        @media (max-width: 800px) {
          .nav-buttons { flex-direction: column; }
          .tamko-content > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default PersonalLoan;