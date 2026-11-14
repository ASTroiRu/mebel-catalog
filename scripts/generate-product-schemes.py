"""Project-owned schematic SVGs; not production drawings or photographs."""
from pathlib import Path
from html import escape
ROOT = Path(__file__).resolve().parents[1] / 'public/images/products'
INK='#817766'; WOOD='#d3bea2'; LIGHT='#e4d9cc'; GLASS='#c1cecc'
def rect(x,y,w,h,fill=LIGHT,stroke=INK,sw=3): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def line(x,y,X,Y,color=INK,sw=3): return f'<path d="M{x} {y}L{X} {Y}" fill="none" stroke="{color}" stroke-width="{sw}"/>'
def text(x,y,t,size=20): return f'<text x="{x}" y="{y}" text-anchor="middle" font-family="sans-serif" font-size="{size}" fill="#655e55">{escape(t)}</text>'
def glass(x,y,w,h): return rect(x,y,w,h,GLASS)+line(x+20,y+h*.5,x+w*.55,y+20,'#edf3ef',5)+line(x+w*.4,y+h-20,x+w-20,y+h*.5,'#edf3ef',5)
def handle(x,y): return line(x,y,x,y+65,'#514b43',6)
def drawers(x,y,w,n=3):
 return ''.join(rect(x,y+i*60,w,60,WOOD)+line(x+w*.4,y+i*60+22,x+w*.6,y+i*60+22,'#514b43',5) for i in range(n))
def write(slug,title,body,view):
 svg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><title>'+escape(title)+'</title>'+rect(0,0,1200,800,'#f5f1eb','none')+text(600,65,title,28)+body+text(600,700,view)+text(600,744,'Условная схема · Не рабочий чертёж · Без размеров',18)+'</svg>'
 (ROOT/(slug+'.svg')).write_text(svg)
def kitchen_row(y=220):
 body=''.join(rect(160+i*176,y,176,140,WOOD) for i in range(5))
 body+=rect(370,y+25,110,85,'#e7e4db')+rect(385,y+40,80,55,'#b7bdb8')
 body+=rect(735,y+20,105,100,'#5f5c56')
 for x,Y in [(760,y+44),(814,y+44),(760,y+94),(814,y+94)]: body+=f'<circle cx="{x}" cy="{Y}" r="15" fill="none" stroke="#d8d1c5" stroke-width="3"/>'
 return body
write('linia','Линия — прямая кухня',kitchen_row(300),'Вид сверху · Шкафы и рабочая поверхность в один ряд')
write('balans','Баланс — угловая кухня',kitchen_row(170)+''.join(rect(160,310+i*105,176,105,WOOD) for i in range(3)),'Вид сверху · Рабочая поверхность вдоль двух стен')
write('atmosfera','Атмосфера — кухня с островом',kitchen_row(160)+rect(365,435,490,145,WOOD)+line(610,435,610,580)+text(610,520,'Остров',23),'Вид сверху · Между кухней и островом нужен проход')
for slug,title in [('vertikal','Вертикаль'),('garmoniya','Гармония'),('elegant','Элегант')]:
 b=''
 for i in range(3):
  x=240+i*240;h=300 if slug=='garmoniya' else 470
  b+=rect(x,150,240,h,WOOD if slug=='elegant' else LIGHT)+handle(x+215,330)
  if slug=='garmoniya': b+=drawers(x,450,240,3)
  if slug=='elegant':
   for off in [35,77,120,164,205]: b+=f'<path d="M{x+off} 160q-16 100 0 200t0 250" fill="none" stroke="#b59c7a" stroke-width="2"/>'
 b+=line(225,638,975,638)
 write(slug,title+' — распашной шкаф',b,'Вид спереди · '+('Нижние выдвижные ящики' if slug=='garmoniya' else 'Три распашные двери'))
for slug,title in [('prostranstvo','Пространство'),('kontur','Контур'),('panorama','Панорама')]:
 b=''
 for i in range(3):
  x=180+i*280;b+=rect(x,160,280,460,WOOD,'#514b43',7)
  if slug=='panorama': b+=glass(x+12,172,256,335)+rect(x+12,507,256,100,WOOD)
  if slug=='kontur': b+=glass(x+12,300,256,160)+line(x,300,x+280,300,'#514b43',7)+line(x,460,x+280,460,'#514b43',7)
  b+=handle(x+18,370)
 b+=line(170,635,1030,635)+line(170,644,1030,644)
 write(slug,title+' — шкаф-купе',b,'Вид спереди · Двери сдвигаются по направляющим')
for slug,title in [('poryadok','Порядок'),('komfort','Комфорт'),('privat','Приват')]:
 b=''
 for i in range(3):
  x=180+i*280;b+=rect(x,150,280,480,'#ded4c3')
  b+=rect(x+12,162,256,70,WOOD)
  if i==0 and slug!='privat':
   for Y in [300,380,460]: b+=line(x+12,Y,x+268,Y)
  else:
   b+=line(x+20,270,x+260,270,'#514b43',5)
   for X in [x+75,x+195]: b+=f'<path d="M{X} 275v22l-45 38h90l-45-38" fill="none" stroke="#817766" stroke-width="3"/>'
  if slug!='poryadok': b+=drawers(x+12,510,256,2)
  if slug=='privat': b+=glass(x+12,242,256,260)+handle(x+245,360)
 b+=line(165,645,1035,645)
 write(slug,title+' — гардеробная',b,'Вид спереди · '+({'poryadok':'Открытые полки и штанги','komfort':'Открытые секции и нижние ящики','privat':'Стеклянные двери и нижние ящики'}[slug]))
