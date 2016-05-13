#include <SoftwareSerial.h>
#include "OneButton.h"
SoftwareSerial Wifi(9, 6); // RX | TX
OneButton button(A10, false);
const String ssid = "AlisApp";
const String pass = "alisapp10";
const String host = "10.10.0.1";
const String port = "1337";
const int alertLed = 7;

String inputString = "";
boolean stringComplete = false;
boolean wifiError = false;
boolean tcpError = false;
void setup()
{
  Serial.begin(9600);
  Wifi.begin(9600);
  
  inputString.reserve(200);
  writeCommand("AT+CWMODE=1");
  writeCommand("AT+CIPMUX=0");
  writeCommand("AT+CIPCLOSE");
  tryTcpConection();
  
  /*Eventos de boton*/
  //button.setClickTicks(800);
  button.attachDoubleClick(eDoubleClick);
  button.attachClick(eClick);
  button.attachLongPressStart(ePress);
  pinMode(alertLed,OUTPUT);
  delay(200);
  sendPulse(4);
}
bool prevState=false;
int readPin;
void loop()
{
  if(wifiError) blinkAlert(1000);
  else if(tcpError) blinkAlert(300);
  else{
    button.tick();
    delay(10);
  }
}
void eClick(){
  sendPulse(1);
  //blinkAlert(100);
}
void eDoubleClick(){
  sendPulse(2);
  //blinkAlert(100);
  //blinkAlert(100);
}
void ePress(){
  sendPulse(3);
  //blinkAlert(1000);
}
void blinkAlert(int delayT){
  digitalWrite(alertLed, HIGH);
  delay(delayT);
  digitalWrite(alertLed, LOW);
  delay(delayT);
}
void writeCommand(String command){
  inputString="";
  stringComplete = false;
  Wifi.println(command);
  delay(10);
  do{
    while (Wifi.available()){
      char inChar = (char)Wifi.read();
      inputString += inChar;
      if (inChar == '\n') stringComplete = true;
    }
  }while(!stringComplete);
  //Serial.println(inputString);
}
void tryWifiConection(){
  boolean first = true;
  int trys = 0;
  do{
    if(!first) delay(5000); //si no es el primer intento, espera 5 segundos para volver a intentar
    writeCommand("AT+CWJAP=\""+ssid+"\",\""+pass+"\"");
    first = false;
    trys++;
  }while(inputString.indexOf("OK")==-1 && trys<10); //intentara la comunicacion 10 veces, de no lograrlo se pasa a estado error
  if(trys>=10) wifiError = true;
}
void tryTcpConection(){
  //antes verifica que se tiene una ip
  writeCommand("AT+CIFSR");
  if(inputString.indexOf("0.0.0.0")!=-1) tryWifiConection(); //primero resolver error wifi antes de establecer comunicacion tcp
  boolean first = true;
  int trys = 0;
  if(!wifiError){
   do{
      if(!first) delay(2000); //si no es el primer intento, espera 2 segundos para volver a intentar
      writeCommand("AT+CIPSTART=\"TCP\",\""+host+"\","+port);
      first = false;
      trys++;
    }while(inputString.indexOf("ERROR")!=-1 && trys<10); //intentara la comunicacion 10 veces, de no lograrlo se pasa a estado error tcp
    if(trys>=10) tcpError = true; 
  }
}
void sendPulse(int signal){
  boolean first = true;
  do{
    if(!first) tryTcpConection(); //fallo conexion tcp
    if(wifiError || tcpError) break;
    writeCommand("AT+CIPSEND=1");
    first = false;
  }while(inputString.indexOf("not")!=-1);
  if(!wifiError && !tcpError) writeCommand(String(signal));
}
