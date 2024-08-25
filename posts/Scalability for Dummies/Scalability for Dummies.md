---
title: Scalability for Dummies
date: 2024-08-25
content: about scalability
category: All, Scalability, BE
---

다음은 Le Cloud Blog의 Sebastian Kreutzberger가 작성한 Scalability for Dummies 글을 claude로 번역한 글입니다.

## Scalability for Dummies - Part 1: Clones

***Clones***

확장 가능한 웹 서비스의 공개 서버들은 로드 밸런서 뒤에 숨겨져 있습니다. 이 로드 밸런서는 사용자로부터의 요청(부하)을 애플리케이션 서버 그룹/클러스터에 균등하게 분배합니다. 예를 들어, 제이든이라는 사용자가 여러분의 서비스를 이용할 때, 첫 번째 요청은 2번 서버가, 두 번째는 9번 서버가, 그리고 세 번째는 다시 2번 서버가 처리할 수 있습니다.

중요한 점은 제이든이 어떤 서버를 통해 서비스를 이용하든 항상 동일한 결과를 받아야 한다는 것입니다. 이것이 바로 확장성의 첫 번째 황금률입니다: 모든 서버는 똑같은 코드를 가지고 있어야 하며, 사용자의 세션이나 프로필 사진 같은 개인 데이터를 각 서버에 저장해서는 안 됩니다. 대신, 이런 정보는 모든 서버가 접근할 수 있는 중앙 데이터 저장소에 보관해야 합니다. 이때 외부 데이터베이스나 Redis 같은 인메모리 캐시를 사용할 수 있는데, 특히 인메모리 캐시가 더 빠른 성능을 보입니다. 여기서 '외부'란 이 저장소가 각 서버 안에 있지 않고, 서버들이 있는 데이터 센터 내부나 근처에 별도로 존재한다는 뜻입니다.

그렇다면 새로운 코드를 어떻게 배포해야 할까요? 모든 서버에 동시에 새 코드를 적용하면서, 어떤 서버도 오래된 코드를 실행하지 않도록 하려면 어떻게 해야 할까요? 다행히 Capistrano라는 도구가 이 문제를 잘 해결해 줍니다. Ruby on Rails에 익숙하지 않다면 배우는 데 시간이 좀 걸릴 수 있지만, 충분히 가치 있는 투자입니다.

이렇게 세션 정보를 외부로 옮기고 모든 서버가 같은 코드를 쓰게 만든 다음에는, 이 중 한 서버의 이미지를 만들 수 있습니다. AWS에서는 이를 AMI(Amazon Machine Image)라고 부릅니다. 이 이미지를 'super-clone'으로 삼아 새로운 서버를 띄울 때마다 사용하면 됩니다. 새 서버를 시작할 때는 이 이미지를 바탕으로 최신 코드만 추가로 배포하면 끝입니다!


## Scalability for Dummies - Part 2: Database

Part1을 따라했다면, 여러분의 서버는 이제 수평적으로 확장할 수 있고 수천 개의 동시 요청도 처리할 수 있을 겁니다. 하지만 시간이 지나면서 애플리케이션이 점점 느려지다가 결국 멈춰버리는 상황이 올 수 있습니다. 그 주범은 바로 데이터베이스죠. MySQL일 가능성이 높습니다, 그렇죠?

여기서 필요한 것은 단순히 서버를 더 추가하는 것보다 훨씬 더 근본적이고, 어쩌면 약간의 용기가 필요할 수 있습니다. 여러분은 두 가지 선택지 중 하나를 골라야 합니다:

**선택 1**은 MySQL을 계속 사용하면서 미래가 안보이는 서버를 계속 운영하는 것입니다. DBA를 고용해서 master-slave 복제(읽기는 슬레이브에서, 쓰기는 마스터에서)를 구현하고, 마스터 서버에 RAM을 계속 추가하는 겁니다. 몇 달 후면 여러분의 DBA가 "샤딩", "비정규화", "SQL 튜닝" 같은 용어를 입에 달고 다니며, 앞으로 몇 주간 야근할 생각에 한숨 쉬게 될 겁니다. 이 시점부터는 데이터베이스를 유지하기 위한 모든 조치가 점점 더 비싸고 시간도 오래 걸릴 겁니다. 데이터 규모가 작고 옮기기 쉬웠을 때 선택 2를 골랐다면 좋았을 텐데, 하는 후회가 들 수도 있습니다.

**선택 2**는 처음부터 데이터를 비정규화하고 데이터베이스 쿼리에서 조인을 아예 없애는 것입니다. MySQL을 그대로 쓰되 NoSQL처럼 사용하거나, 아니면 MongoDB나 CouchDB 같은 NoSQL 데이터베이스로 완전히 갈아타는 거죠. 이렇게 하면 조인 작업은 애플리케이션 코드에서 직접 해야 합니다. 이 변화를 빨리 할수록 나중에 고쳐야 할 코드가 줄어듭니다. 하지만 최신 NoSQL 데이터베이스로 성공적으로 전환하고 앱에서 데이터 조인을 처리하게 만들어도, 결국 시간이 지나면 데이터베이스 요청이 다시 느려지기 시작할 겁니다. 그때가 되면 캐시를 도입해야 할 때입니다.


## Scalability for Dummies - Part 3: Cache

***Cache***

이 시리즈의 2부를 따라했다면, 이제 여러분은 확장 가능한 데이터베이스 솔루션을 갖추게 되었을 겁니다. 테라바이트 규모의 데이터 저장도 더 이상 두렵지 않고, 모든 게 순조로워 보입니다. 하지만 이는 여러분의 관점일 뿐입니다. 실제 사용자들은 여전히 대량의 데이터를 불러올 때 느린 페이지 로딩으로 고통받고 있죠. 이 문제의 해결책은 바로 캐시를 도입하는 것입니다.

여기서 말하는 "캐시"는 Memcached나 Redis 같은 인메모리 캐시를 의미합니다. **파일 기반 캐싱은 절대 사용하지 마세요**. 서버 복제와 자동 확장을 매우 복잡하게 만들 뿐입니다. 인메모리 캐시로 돌아와서, 이는 간단한 키-값 저장소로, 애플리케이션과 데이터베이스 사이에서 버퍼 역할을 합니다. 애플리케이션이 데이터를 읽을 때는 항상 먼저 캐시를 확인하고, 캐시에 없을 때만 데이터베이스에 접근해야 합니다. 왜 이렇게 해야 할까요? **캐시가 엄청나게 빠르기 때문입니다**. 캐시는 모든 데이터를 RAM에 저장하고 초고속으로 요청을 처리합니다. 예를 들어, Redis는 일반적인 서버에서도 초당 수십만 건의 읽기 작업을 처리할 수 있습니다. 쓰기 작업, 특히 증분 연산도 매우 빠릅니다. 이런 성능을 데이터베이스로는 절대 낼 수 없죠!

데이터 캐싱에는 두 가지 주요 패턴이 있습니다:

**#1 - 쿼리 결과 캐싱**: 이는 가장 흔히 사용되는 방식입니다. 데이터베이스 쿼리를 실행할 때마다 그 결과를 캐시에 저장합니다. 쿼리문의 해시값을 캐시 키로 사용하죠. 다음에 같은 쿼리를 실행할 때는 먼저 캐시를 확인합니다. 하지만 이 방식에는 문제가 있습니다. 주로 캐시 무효화가 어렵다는 점이죠. 복잡한 쿼리의 결과를 캐시했을 때 (대부분의 경우가 그렇죠), 데이터가 변경되면 관련된 모든 캐시를 찾아 삭제하기가 매우 까다롭습니다.

**#2 - 객체 캐싱**: 제가 강력히 추천하는 방식입니다. 데이터를 객체 형태로 다루는 거죠. 클래스가 데이터베이스에서 정보를 가져와 객체를 만들면, 그 객체 전체를 캐시에 저장합니다. 예를 들어, "Product" 클래스가 있고 이 클래스의 "data" 속성에 제품의 가격, 설명, 이미지, 리뷰 등을 저장한다고 해봅시다. 이 데이터를 조립하는 과정에서 여러 번의 데이터베이스 쿼리가 필요할 텐데, 이렇게 만들어진 최종 객체를 통째로 캐시에 저장하는 겁니다. 이렇게 하면 데이터가 변경됐을 때 해당 객체의 캐시만 삭제하면 되니 관리가 훨씬 쉽습니다. 게다가 비동기 처리도 가능해집니다. 백그라운드에서 여러 워커가 객체를 만들어 캐시에 저장하고, 애플리케이션은 그저 캐시된 객체를 가져다 쓰기만 하면 되니까요!

(*아래는 제가 따로 추가한 객체 캐싱 코드입니다.)
```
import redis.clients.jedis.Jedis;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;


public class Product {
    private int id;
    private String name;
    private double price;
    private String description;
    private List<String> reviews;


	//gettet, setter는 생략

    public void loadData() {
        try (Jedis jedis = new Jedis("localhost", 6379)) {
            String cacheKey = "product:" + this.id;
            String cachedData = jedis.get(cacheKey);

            ObjectMapper mapper = new ObjectMapper();

            if (cachedData != null) {
                // cache miss...
                Product cachedProduct = mapper.readValue(cachedData, Product.class);
                this.name = cachedProduct.name;
                this.price = cachedProduct.price;
                this.description = cachedProduct.description;
                this.reviews = cachedProduct.reviews;
            } else {
                // cache hit일 때
                fetchFromDatabase();
                String jsonData = mapper.writeValueAsString(this);
                jedis.set(cacheKey, jsonData);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void fetchFromDatabase() {
        // 실제로는 여기서 데이터베이스 쿼리를 수행합니다.
        // 아래는 간단한 더미 데이터입니다.
        this.name = "Product " + this.id;
        this.price = 100.0;
        this.description = "product 예시";
        this.reviews = List.of("좋네요", "제품이 별로..");
    }

    public static void main(String[] args) {
        Product product = new Product();
        product.setId(1);
        product.loadData();
        System.out.println(product);

        // 다시 같은 제품을 로드하면 캐시에서 가져옵니다
        Product sameProduct = new Product();
        sameProduct.setId(1);
        sameProduct.loadData();
    }
}
```

위 코드를 보면 objectmapper를 불러와서 string으로 저장하고 읽고 있네요. 만약 스프링 data redis를 이용하면 아래처럼 boilerplate코드를 줄일 수 있습니다.

```
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    @Cacheable(value = "products", key = "#id")
    public Product getProduct(Long id) {
        // 실제로는 여기서 데이터베이스에서 제품을 조회합니다.
        System.out.println("Fetching product from database");
        return new Product(id, "Product " + id, 100.0);
    }
}

public class Product {
    private Long id;
    private String name;
    private double price;

    // 생성자, getter, setter
}
```




캐시에 저장하면 좋을 만한 것들:

- 사용자 세션 정보 (이건 절대 데이터베이스에 저장하지 마세요!)
- 완성된 블로그 포스트 HTML
- 사용자 활동 피드
- 사용자 간 친구 관계

제가 캐싱을 매우 좋아한다는 걸 느끼셨나요? 이해하기 쉽고, 구현도 간단한데, 효과는 정말 놀랍습니다. 개인적으로는 Memcached보다 Redis를 선호합니다. Redis는 데이터 지속성을 지원하고, 리스트나 세트 같은 자료구조를 제공하는 등 추가 기능이 많거든요. 잘만 사용하면 Redis로 데이터베이스를 완전히 대체할 수도 있습니다. 하지만 단순히 캐싱만 필요하다면 Memcached도 좋은 선택입니다. 확장성이 뛰어나거든요. 즐겁게 캐싱하세요!


## Scalability for Dummies - Part 4: Asynchronism

이번 시리즈는 다음 상황을 상상해보는 것으로 시작합니다. 여러분이 가장 좋아하는 빵집에 빵을 사러 갔다고 해봅시다. 빵집에 들어가 빵 한 덩이를 달라고 했는데, 빵이 없대요! 대신 2시간 후에 빵이 준비되면 다시 오라고 합니다. 짜증 나지 않나요? 이런 상황을 피하려면 비동기 처리가 필요합니다. 빵집에서 효과적인 이 방법은 여러분의 웹 서비스나 앱에도 똑같이 유용할 수 있습니다.

비동기 처리에는 보통 두 가지 방식이 있습니다.

**Async #1** 앞서 언급한 빵집 이야기로 돌아가 봅시다. 첫 번째 비동기 처리 방식은 "밤에 빵을 미리 구워놓고 아침에 팔기"입니다. 손님은 기다릴 필요 없이 바로 빵을 살 수 있어 만족스럽죠. 이를 웹 앱에 적용하면, 시간이 오래 걸리는 작업을 미리 해두고 사용자 요청이 올 때 빠르게 결과를 제공하는 겁니다. 이 방식은 주로 동적 콘텐츠를 정적 콘텐츠로 바꾸는 데 쓰입니다.

예를 들어, 복잡한 프레임워크나 CMS로 만든 웹사이트 페이지들을 미리 HTML 파일로 만들어 저장해두는 거죠. 이런 작업은 보통 정기적으로, 가령 매시간마다 cron 작업으로 실행되는 스크립트를 통해 이뤄집니다. 이렇게 전반적인 데이터를 미리 처리해두면 웹사이트와 앱의 성능과 확장성이 크게 향상됩니다. 더 나아가 이렇게 만든 HTML 페이지를 AWS S3나 Cloudfront, 또는 다른 CDN에 올려둔다면 어떨까요? 여러분의 웹사이트는 엄청나게 빨라지고, 시간당 수백만 명의 방문자도 거뜬히 처리할 수 있을 겁니다!

**Async #2** 다시 빵집 이야기로 돌아가 봅시다. 때론 손님들이 "생일 축하해요, 제이든!"이라고 쓴 특별한 생일 케이크 같은 걸 주문하기도 합니다. 빵집에서는 이런 특별 주문을 미리 예측할 수 없으니, 손님이 주문할 때 작업을 시작하고 다음 날 다시 오라고 해야 합니다. 웹 서비스에 이를 적용하면 작업을 비동기적으로 처리하는 것과 같습니다.

일반적인 과정은 이렇습니다: 사용자가 웹사이트에서 시간이 많이 걸리는 작업을 시작합니다. 웹사이트는 이 작업을 작업 대기열에 넣고 사용자에게 "작업이 진행 중이니 다른 일을 하면서 기다려 주세요"라고 알립니다. 여러 작업자(worker)들이 이 대기열을 계속 확인하다가 새 작업이 들어오면 처리합니다. 작업이 끝나면 완료 신호를 보내고, 이를 계속 확인하던 웹사이트가 사용자에게 작업 완료를 알립니다.

이는 매우 단순화한 설명입니다. 더 자세한 내용과 실제 기술적인 구현에 대해 알고 싶다면, RabbitMQ 웹사이트의 첫 세 개 튜토리얼을 보는 것을 추천합니다. RabbitMQ는 비동기 처리를 구현하는 데 도움을 주는 여러 시스템 중 하나입니다. ActiveMQ나 간단한 Redis 리스트를 사용할 수도 있죠. 핵심 아이디어는 작업자들이 처리할 수 있는 작업 대기열을 만드는 것입니다.

비동기 처리는 복잡해 보일 수 있지만, 배우고 실제로 구현해볼 만한 가치가 충분합니다. 이를 통해 백엔드는 거의 무한히 확장할 수 있고, 프론트엔드는 빠르게 반응하여 전반적인 사용자 경험이 좋아집니다. 시간이 많이 걸리는 작업이 있다면 항상 비동기적으로 처리하는 방법을 고민해보세요.
